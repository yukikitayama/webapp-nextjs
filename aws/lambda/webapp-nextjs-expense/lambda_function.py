from pymongo import MongoClient
from bson.objectid import ObjectId
import boto3
from datetime import datetime
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'db-react'
COLLECTION = 'expense'


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
collection = client[DATABASE][COLLECTION]


def add_document(event):
    
    # Get user input
    body = json.loads(event['body'])
    date = body['date']
    item = body['item']
    type_ = body['type']
    amount = float(body['amount'])
    place = body['place']
    memo = ''
    if 'memo' in body:
        memo = body['memo']
        
    # Make document for MongoDB
    document = {
        'date': date,
        'item': item,
        'type': type_,
        'amount': amount,
        'place': place,
        'memo': memo,
        'creation_time': datetime.utcnow()
    }
    
    # Upload it to MondoDB
    result = collection.insert_one(document)
    print(f'Added a new expense item with ObjectId: {result.inserted_id}')


def update_document(event):
    
    # Get user input
    body = json.loads(event['body'])
    date = body['date']
    item = body['item']
    type_ = body['type']
    amount = body['amount']
    place = body['place']
    memo = body['memo'] if 'memo' in body else ''
    object_id = ObjectId(body['id'])
    
    # Make document for MongoDB
    filter_ = { '_id': object_id }
    new_values = { 
        '$set': {
            'date': date,
            'item': item,
            'type': type_,
            'amount': amount,
            'place': place,
            'memo': memo,
            'last_modified': datetime.utcnow()
        }
    }
    
    # Upload 
    result = collection.update_one(filter_, new_values)
    print(f'update_one() result.modified_count: {result.modified_count}')


def delete_document(event):
    
    # Get user input
    body = json.loads(event['body'])
    object_id = ObjectId(body['id'])
    
    # Delete
    result = collection.delete_one({ '_id': object_id })
    print(f'delete_one() result.deleted_count: {result.deleted_count}')


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'POST':
        print('POST')
        
        add_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Added the new expense successfully' })
        }
        
    elif event['httpMethod'] == 'PUT':
        print('PUT')
        
        update_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Received PUT request' })
        }
    
    elif event['httpMethod'] == 'DELETE':
        print('DELETE')
        
        delete_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Received DELETE request' })
        }


if __name__ == '__main__':
    event = {
        'httpMethod': 'POST'
    }
    pprint.pprint(lambda_handler(event, None))
