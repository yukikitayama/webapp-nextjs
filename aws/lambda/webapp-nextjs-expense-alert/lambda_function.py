from pymongo import MongoClient
import boto3
import json
from datetime import datetime, timedelta
import calendar


PARAMETER_01 = 'budget'
PARAMETER_02 = 'budget-warning'
REGION_NAME = 'us-west-1'
SECRET_ID_01 = 'mongodb-website'
SECRET_ID_02 = 'aws-ses'
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
secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]
collection = db[COLLECTION]

# Parameter Store
ssm = boto3.client('ssm', region_name=REGION_NAME)


def get_parameter_value(parameter):
    response = ssm.get_parameters(Names=[parameter], WithDecryption=True)
    value = response['Parameters'][0]['Value']
    return value


def get_current_expense(start_date, end_date):
    pipeline = [
        { '$addFields': { 'convertedDate': { '$toDate': '$date' } } },
        { '$match': { 'convertedDate': { '$gte': start_date, '$lt': end_date } } },
        { '$group': {
            '_id': { 'type': '$type' },
            'totalExpense': { '$sum': '$amount' }
        } },
        { '$sort': { '_id.type': 1 } }
    ]
    normal, special = 0, 0
    for expense in collection.aggregate(pipeline):
        if expense['_id']['type'] == 'normal':
            normal = expense['totalExpense']
        elif expense['_id']['type'] == 'special':
            special = expense['totalExpense']
    return normal, special


def send_alert(normal, current_budget, budget_warning):
    
    # Get secret
    secret_ses = get_secret(secret_id=SECRET_ID_02, region_name=REGION_NAME)
    sender = secret_ses['sender']
    recipient = secret_ses['recipient']
    
    # Make SES information
    client = boto3.client('ses', region_name=REGION_NAME)
    subject = "Yuki's App Expense Alert"
    source = f"Yuki's App <{sender}>"
    body = \
        f'<html>' \
        f'<head></head>' \
        f'<body>' \
        f'  <p>Current normal expense: {normal}, current budget: {current_budget}, budget warning: {budget_warning}</p>' \
        f'</body>' \
        f'</html>'

    # Send email
    response = client.send_email(
        Destination={
            'ToAddresses': [
                recipient
            ]
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': 'UTF-8',
                    'Data': body
                }
            },
            'Subject': {
                'Charset': 'UTF-8',
                'Data': subject
            }
        },
        Source=source
    )
    print(f'MessageId: {response["MessageId"]}')


def lambda_handler(event, context):
    
    # Get parameter
    budget = int(get_parameter_value(parameter=PARAMETER_01))
    budget_warning = int(get_parameter_value(parameter=PARAMETER_02))

    # Make dates
    end_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = end_date.replace(day=1)
    end_date += timedelta(days=1)
    
    # print(f'start: {start_date}, end: {end_date}')
    
    # Compute current budget
    current_days = (end_date - start_date).days
    now = datetime.now()
    # monthrange() returns (weekday 0-6, days)
    total_days = calendar.monthrange(now.year, now.month)[1]
    current_budget = (budget / total_days) * current_days

    # Get current expense
    normal, special = get_current_expense(start_date=start_date, end_date=end_date)

    # print(f'normal: {normal}, special: {special}')
    
    # Send alert
    if normal > current_budget + budget_warning:
        send_alert(normal, current_budget, budget_warning)
    else:
        print('no alert')

    # Loggin
    print(f'start_date: {start_date}, end_date: {end_date}, '
          f'normal: {normal}, special: {special}, '
          f'current_budget: {current_budget}, budget_warning: {budget_warning}')


if __name__ == '__main__':
    lambda_handler('', '')
