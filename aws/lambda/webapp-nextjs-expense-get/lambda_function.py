from pymongo import MongoClient
from bson.objectid import ObjectId
import boto3
from datetime import datetime
import collections
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'db-react'
COLLECTION = 'expense'
CATEGORY_NUM = 7


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


def get_category_expense(start_date: datetime, end_date: datetime, collection):

    # Get total expense by item
    pipeline = [
        { '$addFields': { 'convertedDate': { '$toDate': '$date' } } },
        { '$match': { 'convertedDate': { '$gte': start_date, '$lte': end_date } } },
        { '$group': {
            '_id': { 'item': '$item' },
            'expense': { '$sum': '$amount' }
        } },
        { '$sort': { 'expense': -1 } }
    ]
    
    # Divide the total by the number of months to get monthly average
    expenses = []
    diff_month = (end_date - start_date).days / 30
    i = 0
    other = 0
    for expense in collection.aggregate(pipeline):
        category = expense['_id']['item']
        amount = round(expense['expense'] / diff_month, 1)
        i += 1
        if i >= CATEGORY_NUM:
            other += amount
        else:
            expenses.append({ 'category': category, 'expense': amount })
    expenses.append({ 'category': 'other', 'expense': other})

    return expenses


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if event['httpMethod'] == 'GET':
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
                    
                # Get categorical total expense
                if type_ == 'category':
                    
                    expenses = get_category_expense(
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
    # event = {
    #     'httpMethod': 'GET',
    #     'queryStringParameters': {
    #         'type': 'monthly',
    #         'startDate': '2022-02-01',
    #         'endDate': '2022-03-18'
    #     }
    # }
    event = {
        'httpMethod': 'GET',
        'queryStringParameters': {
            'type': 'category',
            'startDate': '2021-10-01',
            'endDate': '2022-03-18'
        }
    }
    pprint.pprint(lambda_handler(event, None))
