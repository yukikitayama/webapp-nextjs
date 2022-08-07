from confluent_kafka import Consumer
import redshift_connector
import boto3
import json
from datetime import datetime
import pprint


REGION_NAME_01 = 'us-west-1'
PARAMETERS = [
    'CLOUDKARAFKA_BROKERS',
    'CLOUDKARAFKA_TOPIC',
    'CLOUDKARAFKA_USERNAME',
    'CLOUDKARAFKA_PASSWORD',
    'REDSHIFT_HOST',
    'REDSHIFT_USER',
    'REDSHIFT_PASSWORD'
]
PORT = 5439
DATABASE = 'dev'


def get_parameters() -> dict:
    ssm = boto3.client('ssm', region_name=REGION_NAME_01)
    response = ssm.get_parameters(Names=PARAMETERS, WithDecryption=True)
    params = {}
    for parameter in response['Parameters']:
        params[parameter['Name']] = parameter['Value']
    return params


def lambda_handler(event, context):
    
    # Get parameters
    params = get_parameters()

    # Make Kafka client
    conf = {
        'bootstrap.servers': params['CLOUDKARAFKA_BROKERS'],
        'group.id': f'{params["CLOUDKARAFKA_USERNAME"]}-consumer',
        'session.timeout.ms': 6000,
        'default.topic.config': {'auto.offset.reset': 'smallest'},
        'security.protocol': 'SASL_SSL',
        'sasl.mechanism': 'SCRAM-SHA-256',
        'sasl.username': params['CLOUDKARAFKA_USERNAME'],
        'sasl.password': params['CLOUDKARAFKA_PASSWORD']
    }
    consumer = Consumer(**conf)
    consumer.subscribe([params['CLOUDKARAFKA_TOPIC']])
    
    # Make Redshift client
    print('Connecting to Redshift...')
    conn = redshift_connector.connect(
        host=params['REDSHIFT_HOST'],
        port=PORT,
        database=DATABASE,
        user=params['REDSHIFT_USER'],
        password=params['REDSHIFT_PASSWORD']
    )
    print('Connected to Redshift!')
    cursor = conn.cursor()
    
    # Get events
    msg = consumer.poll(timeout=1.0)
    value = json.loads(msg.value())
    timestamp = msg.timestamp()[1]
    dt = datetime.fromtimstamp(timestamp // 1000)
    consumer.close()
    
    print('Kafka')
    pprint.pprint(value)
    print(dt)
    print()
    
    # Upload the data to Redshift
    query = f"""
    insert into
        webapp.access_log (ip_address, path, created_at)
    values
        ('{value["ip"]}', '{value["path"]}', '{dt.strftime("%Y-%m-%d %H:%M:%S")}');
    """
    print('Redshift')
    print(query)
    print()
    cursor.execute(query)
    conn.commit()


if __name__ == '__main__':
    lambda_handler('', '')
