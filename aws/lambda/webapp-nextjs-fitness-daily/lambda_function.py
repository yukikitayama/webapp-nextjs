from pymongo import MongoClient
import boto3
from datetime import datetime
from collections import deque
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'fitbit'
WINDOW_SIZE = 7
WEIGHT_GUESS = 57


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secrets
secret_mongodb = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    # Queue to compute moving average on the fly
    queue = deque()
    average = None
    
    if (
        'queryStringParameters' in event
        and event['queryStringParameters'] is not None
        and 'data' in event['queryStringParameters']
    ):
        data = event['queryStringParameters']['data']
        start = event['queryStringParameters']['start']
        end = event['queryStringParameters']['end']
        
        # print(f'data: {data}, start: {start}, end: {end}')
        
        # Daily calory burn
        if data == 'calories':
            collection = db['activity-calories']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'activities-calories': 1 }
            response_data = []
            for calorie in collection.find(filter_, projection):
                value = int(calorie['activities-calories'][0]['value'])

                queue.append(value)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 1)
                    queue.popleft()
                
                response_data.append({
                    'date': calorie['activities-calories'][0]['dateTime'],
                    'value': value,
                    'movingAverage': average
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'steps':
            collection = db['activity-steps']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'activities-steps': 1 }
            response_data = []
            for step in collection.find(filter_, projection):
                value = int(step['activities-steps'][0]['value'])
                
                queue.append(value)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 1)
                    queue.popleft()
                
                response_data.append({
                    'date': step['activities-steps'][0]['dateTime'],
                    'value': value,
                    'movingAverage': average
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }

        elif data == 'water':
            collection = db['water-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for water in collection.find(filter_, projection):
                value = int(water['summary']['water'])
                
                queue.append(value)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 1)
                    queue.popleft()
                
                response_data.append({
                    'date': water['date'],
                    'value': value,
                    'movingAverage': average
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'weight':
            collection = db['weight-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'weight': 1 }
            response_data = []
            # When the first weight is None, set a guess
            value = WEIGHT_GUESS
            for weight in collection.find(filter_, projection):
                # When not measuring weight, weight['weight'] has an empty list
                # weight['weight'] always contain list of objects.
                # When measuring once per day, the length of the list is one
                # When measuring multiple times on the same date, 
                # weight['weight'][0] has the first measumeant, and [1] has the second, and so on.
                # If current weight is None and previous weight is available, use previous weight as current weight
                value = weight['weight'][0]['weight'] if weight['weight'] else value
                
                queue.append(value)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 1)
                    queue.popleft()
                
                response_data.append({
                    'date': weight['date'],
                    'value': value,
                    'movingAverage': average
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'sleep':
            collection = db['sleep-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for sleep in collection.find(filter_, projection):
                value = sleep['summary']['totalMinutesAsleep']

                queue.append(value)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 1)
                    queue.popleft()

                response_data.append({
                    'date': sleep['date'],
                    'value': value,
                    'movingAverage': average
                })

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'deep-sleep':
            collection = db['sleep-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for sleep in collection.find(filter_, projection):
                total_time_in_bed = sleep['summary']['totalTimeInBed']
                deep = sleep['summary']['stages']['deep']
                deep_percent = round(deep / total_time_in_bed, 2)
                
                queue.append(deep_percent)
                if len(queue) >= WINDOW_SIZE:
                    average = round(sum(queue) / WINDOW_SIZE, 3)
                    queue.popleft()
                
                response_data.append({
                    'date': sleep['date'],
                    'value': deep_percent,
                    'movingAverage': average
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }


if __name__ == '__main__':
    # event = {
    #     'queryStringParameters': {
    #         'data': 'weight',
    #         'start': '2022-02-13',
    #         'end': '2022-03-12'
    #     }
    # }
    # event = {
    #     'queryStringParameters': {
    #         'data': 'calories',
    #         'start': '2022-02-13',
    #         'end': '2022-03-12'
    #     }
    # }
    event = {
        'queryStringParameters': {
            'data': 'deep-sleep',
            'start': '2022-02-13',
            'end': '2022-03-12'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
