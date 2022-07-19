from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.query import SimpleStatement, dict_factory
from cassandra.auth import PlainTextAuthProvider
import pytz
import boto3
from ssl import SSLContext, PROTOCOL_TLSv1_2, CERT_REQUIRED
import json
import uuid
from datetime import datetime, timedelta
import pprint


CERTIFICATE = './sf-class2-root.crt'
SECRET_ID = 'cassandra'
REGION_NAME = 'us-west-1'
KEYSPACE = 'webapp'
SECURE_CONNECT_BUNDLE = './secure-connect-webapp.zip'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


def get_keyspaces_cassandra_client(username: str, password: str):
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


def get_keyspaces_cassandra_data(session):
    query = """
        select 
            * 
        from 
            webapp.project
        ;
    """
    result_set = session.execute(query)
    return list(result_set)


def get_astra_cassandra_client(client_id: str, client_secret: str):
    cloud_config = {
        'secure_connect_bundle': SECURE_CONNECT_BUNDLE
    }
    auth_provider = PlainTextAuthProvider(client_id, client_secret)
    cluster = Cluster(
        cloud=cloud_config,
        auth_provider=auth_provider
    )
    session = cluster.connect()
    return session


def delete_table(session):
    session.execute('drop table if exists project.task;')
    print(f'Deleted a table project.task')


def create_table(session):
    session.execute('use project;')
    query = """
    create table task (
        id uuid primary key,
        status text,
        project text,
        task text,
        priority text,
        start_date date,
        due_date date,
        labels list<text>,
        create_timestamp timestamp,
        last_update_timestamp timestamp
    );
    """
    session.execute(query)
    print(f'Created a table')


def upload_data(session, data):
    for dict_ in data:
        query = f"""
        insert into project.task (
            id,
            status,
            project,
            task,
            priority,
            start_date,
            due_date,
            labels,
            create_timestamp,
            last_update_timestamp
        )
        values (
            {str(dict_['id'])},
            '{dict_["status"]}',
            '{dict_["project"]}',
            '{dict_["task"]}',
            '{dict_["priority"]}',
            '{str(dict_["start_date"])}',
            '{str(dict_["due_date"])}',
            {[] if not dict_["labels"] else str(dict_["labels"])},
            {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))},
            {int(round(datetime.now(tz=pytz.UTC).timestamp() * 1000))}
        );
        """
        print(query)
        session.execute(query)
        print(f'Inserted data with ID: {dict_["id"]}')


def get_date(session):
    result = session.execute('select * from project.task;')
    print(result)
    for row in result:
        print(row)


def create_archive_table(session):
    session.execute('use project;')
    query = """
    create table archived_task (
        id uuid primary key,
        status text,
        project text,
        task text,
        priority text,
        start_date date,
        due_date date,
        labels list<text>,
        create_timestamp timestamp,
        last_update_timestamp timestamp,
        archive_timestamp timestamp
    );
    """
    session.execute(query)
    print(f'Created an archive table')


def main():

    # Get secrets
    secret = get_secret(SECRET_ID, REGION_NAME)
    username = secret['username']
    password = secret['password']
    client_id = secret['client-id']
    client_secret = secret['client-secret']
    
    # Get Keyspaces Cassandra client
    session_keyspaces = get_keyspaces_cassandra_client(username, password)

    # Get data from Keyspaces Cassandra
    data = get_keyspaces_cassandra_data(session_keyspaces)
    # print(f'Type: {type(data)}')
    # print(f'Type of element: {type(data[1])}')
    # pprint.pprint(data[1])
    # print(type(data[1]['due_date']))
    # print(str(data[1]['due_date']))
    # print(type(data[1]['id']))
    # print(str(data[1]['id']))
    # print(type(data[1]['labels']))
    # print(str(data[1]['labels']))
    # print()
    
    # Get Astra Cassandra client
    session_astra = get_astra_cassandra_client(client_id, client_secret)
    
    # Delete table
    delete_table(session_astra)
    
    # Create table
    create_table(session_astra)
    
    # Upload data
    upload_data(session=session_astra, data=data)
    
    # Get data
    get_date(session_astra)

    # Create archive table
    create_archive_table(session_astra)


if __name__ == '__main__':
    main()
