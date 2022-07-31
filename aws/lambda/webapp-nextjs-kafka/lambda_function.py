"""
https://github.com/CloudKarafka/python-kafka-example/blob/master/producer.py
https://github.com/confluentinc/confluent-kafka-python/blob/master/examples/producer.py
https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html#pythonclient-producer
"""


from confluent_kafka import Producer
import boto3
import time
import json
import pprint


REGION_NAME = 'us-west-1'
PARAMETERS = [
    'CLOUDKARAFKA_BROKERS',
    'CLOUDKARAFKA_TOPIC',
    'CLOUDKARAFKA_USERNAME',
    'CLOUDKARAFKA_PASSWORD',
]


def get_kafka_parameters() -> dict:
    ssm = boto3.client('ssm', region_name=REGION_NAME)
    response = ssm.get_parameters(Names=PARAMETERS, WithDecryption=True)
    confluent_params = {}
    for parameter in response['Parameters']:
        confluent_params[parameter['Name']] = parameter['Value']
    return confluent_params


kafka_params = get_kafka_parameters()
conf = {
    'bootstrap.servers': kafka_params['CLOUDKARAFKA_BROKERS'],
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'SCRAM-SHA-256',
    'sasl.username': kafka_params['CLOUDKARAFKA_USERNAME'],
    'sasl.password': kafka_params['CLOUDKARAFKA_PASSWORD']
}
p = Producer(**conf)


def delivery_callback(err, msg):
    if err:
        print(f'Message failed delivery: {err}')
    else:
        print(f'Message delivered to topic: {msg.topic()}, partition: {msg.partition()}')


def lambda_handler(event, context):
    
    # Get data
    body = json.loads(event['body'])
    ip = body['ip']
    path = body['path']

    # Make data for Kafka topic
    data = json.dumps({
        'ip': ip,
        'path': path
    })

    # Produce to Kafka topic
    try:
        # Asynchronously produce a message, the delivery report callback will be
        # triggered from poll() above or flush() below, when the message has
        # been succeessfully delivered or failed permanently

        # p.produce(
        #     topic=kafka_params['CLOUDKARAFKA_TOPIC'], 
        #     value=data
        # )

        p.poll(0)
        p.produce(
            topic=kafka_params['CLOUDKARAFKA_TOPIC'], 
            value=data, 
            callback=delivery_callback
        )
    except BufferError as e:
        print(f'Local producer queue is full ({len(p)} messages awaiting delivery): try again')
    
    # Wait for any outstanding messages to be delivered and delivery report 
    # callbacks to be triggered
    print(f'Waiting for {len(p)} deliveries')
    p.flush()
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': 'Produced to Kafka topic'
        })
    }


# if __name__ == '__main__':
#     event = {
#         'body': json.dumps({
#             'ip': '000.000.000.000',
#             'path': '/'
#         })
#     }
#     pprint.pprint(lambda_handler(event, ''))
    
#     def consume():
        
#         from confluent_kafka import Consumer, KafkaException, KafkaError
#         from datetime import datetime
        
#         conf = {
#             'bootstrap.servers': kafka_params['CLOUDKARAFKA_BROKERS'],
#             'group.id': f'{kafka_params["CLOUDKARAFKA_USERNAME"]}-consumer',
#             'session.timeout.ms': 6000,
#             'default.topic.config': {'auto.offset.reset': 'smallest'},
#             'security.protocol': 'SASL_SSL',
#             'sasl.mechanisms': 'SCRAM-SHA-256',
#             'sasl.username': kafka_params['CLOUDKARAFKA_USERNAME'],
#             'sasl.password': kafka_params['CLOUDKARAFKA_PASSWORD']
    
#         }
#         c = Consumer(**conf)
#         c.subscribe([kafka_params['CLOUDKARAFKA_TOPIC']])
#         try:
#             while True:
#                 msg = c.poll(timeout=1.0)
#                 if msg is None:
#                     continue
#                 if msg.error():
#                     # Error or event
#                     if msg.error().code() == KafkaError._PARTITION_EOF:
#                         # End of partition event
#                         print('%% %s [%d] reached end at offset %d\n' %
#                                          (msg.topic(), msg.partition(), msg.offset()))
#                     elif msg.error():
#                         # Error
#                         raise KafkaException(msg.error())
#                 else:
#                     # Proper message
#                     print('%% %s [%d] at offset %d with key %s:\n' %
#                                      (msg.topic(), msg.partition(), msg.offset(),
#                                       str(msg.key())))
#                     value = json.loads(msg.value())
#                     print('Value:')
#                     pprint.pprint(value)
#                     timestamp = msg.timestamp()[1]
#                     print(f'Timestamp: {datetime.fromtimestamp(timestamp // 1000)}')
    
#         except KeyboardInterrupt:
#             print('%% Aborted by user\n')
    
#         # Close down consumer to commit final offsets.
#         c.close()
    
#     print('Consuming...')
#     consume()
