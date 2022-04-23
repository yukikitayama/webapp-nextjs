import boto3
import json


SECRET_ID = 'aws-ses'
REGION_NAME = 'us-west-1'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


def make_email_body() -> str:
    body = \
        '<html>' \
        '<head></head>' \
        '<body>' \
        '  <h1>This is h1 HTML element</h1>' \
        '  <p>This is p HTML element</p>' \
        '</body>' \
        '</html>'
    return body
    

def main():
    
    # Get secret
    secret = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
    sender = secret['sender']
    recipient = secret['recipient']
    
    # Make SES client
    client = boto3.client('ses')
    
    # Make email subject
    subject = 'Test sending email by SES Python API'
    
    # Make email body
    body = make_email_body()
    
    # Make source
    source = f"Yuki's App <{sender}>"
    
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


if __name__ == '__main__':
    main()
