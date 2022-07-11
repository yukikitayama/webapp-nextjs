from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.query import SimpleStatement
from cassandra.auth import PlainTextAuthProvider
import boto3
from ssl import SSLContext, PROTOCOL_TLSv1_2, CERT_REQUIRED
import json
import uuid
import pprint


CERTIFICATE = './sf-class2-root.crt'
SECRET_ID = 'cassandra'
REGION_NAME = 'us-west-1'
KEYSPACE = 'webapp'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


# Get secrets
secret = get_secret(SECRET_ID, REGION_NAME)
username = secret['username']
password = secret['password']

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


def add_row(event):
    
    # Get user input
    body = json.loads(event['body'])
    # labels = ','.join(f"'{word}'" for word in body['labels'].split(','))
    labels = ','.join(f"'{word}'" for word in body['labels'])
    # print(f'labels: {labels}')
    id_ = uuid.uuid4()
    query = f"""
        INSERT INTO webapp.project (id, project, task, priority, start_date, 
            due_date, labels)
        VALUES ({id_}, '{body["project"]}', '{body["task"]}', 
            '{body["priority"]}', '{body["startDate"]}', '{body["dueDate"]}',
            [{labels}]);
    """
    print(query)
    # Wrap queries to specify the consistency level for write
    wrapped_query = SimpleStatement(
        query,
        consistency_level=ConsistencyLevel.LOCAL_QUORUM
    )
    session.execute(wrapped_query)
    print(f'Uploaded to Cassandra the data with ID: {id_}')

def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'POST':
        
        add_row(event)
    
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Added the new task successfully' })
        }


if __name__ == '__main__':
    event = {
        'httpMethod': 'POST',
        'body': json.dumps({
            'project': 'webapp',
            'task': 'do task 1',
            'priority': 'medium',
            'startDate': '2022-07-10',
            'dueDate': '2022-07-17',
            'labels': ['python', 'javascript']
        })
    }
    pprint.pprint(lambda_handler(event, ''))
