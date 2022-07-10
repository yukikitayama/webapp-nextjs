from cassandra.cluster import Cluster
from ssl import SSLContext, PROTOCOL_TLSv1_2, CERT_REQUIRED
from cassandra.auth import PlainTextAuthProvider
import boto3
import json
import uuid


CERTIFICATE = './sf-class2-root.crt'
SECRET_ID = 'cassandra'
REGION_NAME = 'us-west-1'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


secret = get_secret(SECRET_ID, REGION_NAME)
username = secret['username']
password = secret['password']


def main():
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
    session = cluster.connect()
    
    # r = session.execute('select * from system_schema.keyspaces')
    # for row in r.current_rows:
    #     print(row)

    id_ = uuid.uuid4()
    print(id_)

    query = f"""
        INSERT INTO webapp.project (
            id,
            project,
            task,
            priority,
            start_date,
            due_date,
            labels
        )
        VALUES (
            {id_},
            'project a',
            'task a',
            'medium',
            '2022-07-09',
            '2022-07-16',
            ['label 1', 'label 2']
        );
    """
    r = session.execute(query)
    # print(r)


if __name__ == '__main__':
    main()