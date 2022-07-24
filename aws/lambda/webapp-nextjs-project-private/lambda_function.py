from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.query import SimpleStatement, dict_factory
from cassandra.auth import PlainTextAuthProvider
import pytz
import boto3
from ssl import SSLContext, PROTOCOL_TLSv1_2, CERT_REQUIRED
import json
import uuid
from datetime import datetime
import pprint


CERTIFICATE = './sf-class2-root.crt'
SECRET_ID = 'cassandra'
REGION_NAME = 'us-west-1'
# KEYSPACE = 'webapp'
KEYSPACE = 'project'
TABLE_01 = 'task'
TABLE_02 = 'archived_task'
SECURE_CONNECT_BUNDLE = './secure-connect-webapp.zip'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


def get_keyspaces_cassandra_session(username: str, password: str):
    # Create a Cassandra cluster instance
    ssl_context = SSLContext(PROTOCOL_TLSv1_2)
    ssl_context.load_verify_locations(CERTIFICATE)
    ssl_context.verify_mode = CERT_REQUIRED
    auth_provider = PlainTextAuthProvider(
        username=username, 
        password=password
    )
    cluster = Cluster(
        ['cassandra.us-west-1.amazonaws.com'], 
        ssl_context=ssl_context, 
        auth_provider=auth_provider, 
        port=9142
    )
    # Establish connections
    session = cluster.connect(KEYSPACE)
    session.row_factory = dict_factory
    return session


def get_astra_cassandra_session(client_id: str, client_secret: str):
    cloud_config = {
        'secure_connect_bundle': SECURE_CONNECT_BUNDLE,
        'use_default_tempdir': True
    }
    auth_provider = PlainTextAuthProvider(client_id, client_secret)
    cluster = Cluster(
        cloud=cloud_config,
        auth_provider=auth_provider
    )
    session = cluster.connect()
    session.row_factory = dict_factory
    return session


# Get secrets
secret = get_secret(SECRET_ID, REGION_NAME)
# username = secret['username']
# password = secret['password']
client_id = secret['client-id']
client_secret = secret['client-secret']

# Get Cassandra session
# session = get_keyspaces_cassandra_session(username, password)
session = get_astra_cassandra_session(client_id, client_secret)


def add_task(event):
    
    # Get user input
    body = json.loads(event['body'])
    labels = ','.join(f"'{word}'" for word in body['labels'])
    id_ = uuid.uuid4()
    
    # When a new task is created, status is set to "TO DO" by default
    query = f"""
        insert into {KEYSPACE}.{TABLE_01} (
            id, 
            project, 
            task, 
            priority, 
            start_date, 
            due_date, 
            labels, 
            status,
            create_timestamp,
            last_update_timestamp
        )
        values (
            {id_}, 
            '{body["project"]}',
            '{body["task"]}', 
            '{body["priority"]}',
            '{body["startDate"]}',
            '{body["dueDate"]}',
            [{labels}],
            '{body["status"]}',
            {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))},
            {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))}
        );
    """

    # Amazon Keyspaces
    # Wrap queries to specify the consistency level for write
    # wrapped_query = SimpleStatement(
    #     query,
    #     consistency_level=ConsistencyLevel.LOCAL_QUORUM
    # )
    # session.execute(wrapped_query)
    
    # Astra DB
    session.execute(query)
    
    print(f'Uploaded the data with ID: {id_} to {KEYSPACE}.{TABLE_01}')


def update_task(event):
    body = json.loads(event['body'])
    labels = ','.join(f"'{word}'" for word in body['labels'])
    query = f"""
        update
            {KEYSPACE}.{TABLE_01}
        set
            status = '{body["status"]}',
            project = '{body["project"]}',
            task = '{body["task"]}',
            priority = '{body["priority"]}',
            start_date = '{body["startDate"]}',
            due_date = '{body["dueDate"]}',
            labels = [{labels}],
            last_update_timestamp = {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))}
        where
            id = {body['id']}
        ;
    """
    
    # Amazon Keyspaces
    # wrapped_query = SimpleStatement(
    #     query,
    #     consistency_level=ConsistencyLevel.LOCAL_QUORUM
    # )
    # session.execute(wrapped_query)
    
    # Astra DB
    session.execute(query)
    print(f'Updated the data with ID: {body["id"]} in Cassandra')


def delete_task(event):
    body = json.loads(event['body'])
    query = f"""
        delete from
            {KEYSPACE}.{TABLE_01}
        where
            id = {body["id"]}
        ;
    """
    session.execute(query)
    print(f'Deleted the data with ID: {body["id"]} in Cassandra')


def archive_task(event):
    body = json.loads(event['body'])
    
    # Get data from the task table
    query = f'select * from {KEYSPACE}.{TABLE_01} where id = {body["id"]};'
    result_set = session.execute(query)
    print(f'Get data with ID: {body["id"]} from {KEYSPACE}.{TABLE_01}')
    
    # Insert it to the archive table
    data = list(result_set)[0]
    query = f"""
    insert into {KEYSPACE}.{TABLE_02} (
        id,
        status,
        project,
        task,
        priority,
        start_date,
        due_date,
        labels,
        create_timestamp,
        last_update_timestamp,
        archive_timestamp
    )
    values (
        {str(data['id'])},
        '{data["status"]}',
        '{data["project"]}',
        '{data["task"]}',
        '{data["priority"]}',
        '{str(data["start_date"])}',
        '{str(data["due_date"])}',
        {[] if not data["labels"] else str(data["labels"])},
        {int(round(data["create_timestamp"].timestamp() * 1000))},
        {int(round(data["last_update_timestamp"].timestamp() * 1000))},
        {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))}
    );
    """
    session.execute(query)
    print(f'Inserted the data with ID: {data["id"]} to {KEYSPACE}.{TABLE_02}')
    
    # Delete the task from task table
    query = f"""
    delete from
        {KEYSPACE}.{TABLE_01}
    where
        id = {data['id']}
    ;
    """
    session.execute(query)
    print(f'Deleted the data with ID: {data["id"]} from {KEYSPACE}.{TABLE_01}')
    print(f'Archied the data with ID: {body["id"]} in Cassandra')


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'POST':
        
        add_task(event)
    
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Added the new task successfully' })
        }
        
    elif event['httpMethod'] == 'PUT':
        
        update_task(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Updated the task' })
        }
    
    elif event['httpMethod'] == 'DELETE':
        
        delete_task(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Deleted the task' })
        }
        
    elif event['httpMethod'] == 'PATCH':
        
        archive_task(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Archived the task' })
        }


if __name__ == '__main__':
    # event = {
    #     'httpMethod': 'POST',
    #     'body': json.dumps({
    #         'status': 'to do',
    #         'project': 'Fitness',
    #         'task': 'Register tournament',
    #         'priority': 'high',
    #         'startDate': '2022-07-16',
    #         'dueDate': '2022-07-23',
    #         'labels': ['tennis']
    #     })
    # }
    # event = {
    #     'httpMethod': 'PUT',
    #     'body': json.dumps({
    #         'id': 'f9c35370-c167-49ec-9f03-a1e436fad0c3',
    #         'status': 'in progress',
    #         'project': 'Web Application',
    #         'task': 'Test linear progress 2',
    #         'priority': 'medium',
    #         'startDate': '2022-07-15',
    #         'dueDate': '2022-07-22',
    #         'labels': []
    #     })
    # }
    # event = {
    #     'httpMethod': 'DELETE',
    #     'body': json.dumps({
    #         'id': '304f5b6b-d929-4814-a904-e56aea96a797'
    #     })
    # }
    event = {
        'httpMethod': 'PATCH',
        'body': json.dumps({
            'id': '304f5b6b-d929-4814-a904-e56aea96a797'
        })
    }
    pprint.pprint(lambda_handler(event, ''))
