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


def get_monthly_expense(start_date: datetime, end_date: datetime, collection):
    
    pipeline = [
        # Convert date string to datetime
        { '$addFields': { 'convertedDate': { '$toDate': '$date' } } },
        # Filter documents by start date and end date
        { '$match': { 'convertedDate': {'$gte': start_date, '$lte': end_date} } },
        # Calculate monthly total
        { '$group': {
            '_id': { 
                'year': { '$year': '$convertedDate' },
                'month': { '$month': '$convertedDate' },
                'type': '$type'
            },
            'expense': { '$sum': '$amount' }
        } },
        # Sort by calendar
        { '$sort': { '_id.year': 1, '_id.month': 1, '_id.type': 1 } }
    ]
    
    expenses = []
    prev_year = None
    prev_month = None
    for expense in collection.aggregate(pipeline):
        
        # Make JSON for front-end
        year = expense['_id']['year']
        month = expense['_id']['month']
        type_ = expense['_id']['type']
        amount = expense['expense']
        data = {
            'yearMonth': f'{year}-0{month}' if month < 10 else f'{year}-{month}',
            f'{type_}Expense': amount
        }
        
        # Merge normalExpense and specialExpense if yearMonth are the same
        if expenses and data['yearMonth'] == expenses[-1]['yearMonth']:
            expenses[-1][f'{type_}Expense'] = data[f'{type_}Expense']
        else:
            expenses.append(data)

    return expenses


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'POST':
        # print('POST')
        
        add_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Added the new expense successfully' })
        }
        
    elif event['httpMethod'] == 'PUT':
        # print('PUT')
        
        update_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Received PUT request' })
        }
    
    elif event['httpMethod'] == 'DELETE':
        # print('DELETE')
        
        delete_document(event)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'message': 'Received DELETE request' })
        }
        
    elif event['httpMethod'] == 'GET':
        # print('GET')
        
        if event['queryStringParameters'] is not None:
            
            query_string_parameters = event['queryStringParameters']

            # Get single expense daa by ID
            if 'id' in query_string_parameters:
                pass
            
            if 'type' in query_string_parameters:

                type_ = query_string_parameters['type']
                start_date = query_string_parameters['startDate']
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = event['queryStringParameters']['endDate']
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                
                # Get daily total expense
                if type_ == 'daily':
                    pass

                # Get monthly total expense
                if type_ == 'monthly':
                    
                    expenses = get_monthly_expense(
                        start_date=start_date,
                        end_date=end_date,
                        collection=collection
                    )
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(expenses)
                    }

        # Get all the expense data by descending date oroder


if __name__ == '__main__':
    # event = {
    #     'httpMethod': 'POST'
    # }
    event = {
        'httpMethod': 'GET',
        'queryStringParameters': {
            'type': 'monthly',
            'startDate': '2022-02-01',
            'endDate': '2022-03-18'
        }
    }
    pprint.pprint(lambda_handler(event, None))