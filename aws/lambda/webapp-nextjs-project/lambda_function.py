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


def get_tasks():
    result_set = session.execute(f'select * from {KEYSPACE}.{TABLE_01};')
    tasks = []
    for row in result_set:
        tasks.append({
            'id': str(row['id']),
            'project': row['project'],
            'task': row['task'],
            'priority': row['priority'],
            'startDate': str(row['start_date']),
            'dueDate': str(row['due_date']),
            'labels': row['labels'],
            'status': row['status']
        })
    # print(f'Number of tasks: {len(tasks)}')
    return tasks


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'GET':
        
        tasks = get_tasks()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(tasks)
        }


if __name__ == '__main__':
    event = {
        'httpMethod': 'GET'
    }
    pprint.pprint(lambda_handler(event, ''))
