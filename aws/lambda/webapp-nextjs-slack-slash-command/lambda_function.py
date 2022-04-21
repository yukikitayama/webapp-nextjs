"""
- Set the following environment variables to this Lambda function
  - TOPIC_ARN
"""


import boto3
import json
import os


REGION_NAME = 'us-west-1'


def publish_to_sns(topic_arn: str, message: str):
    sns = boto3.client('sns', region_name=REGION_NAME)
    sns.publish(
        TopicArn=topic_arn,
        Message=message
    )


def lambda_handler(event, context):
    
    # When Lambda receives a request from Slack,
    # event object body key contains a very long string of data from Slack
    # String looks keys and values connected by equal and and signs like 'key1=value1&key2=value2&...'
    slack_data = {k: v for k, v in (kv.split('=') for kv in event['body'].split('&'))}
    # Lambda receives some string in a different format, e.g. '/' -> '%2F'
    command = slack_data['command'].replace('%2F', '/')
    channel_name = slack_data['channel_name']
    text = slack_data['text'] if slack_data['text'] else 'no_text_given'
    
    # Decouple actual process to satisfy 3 seconds rule of Slack slash command
    publish_to_sns(
        topic_arn=os.environ['TOPIC_ARN'], 
        message=json.dumps({'channel_name': channel_name, 'text': text})
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'response_type': 'in_channel',
            'text': f'Running {command}: {text}'
        })
    }
