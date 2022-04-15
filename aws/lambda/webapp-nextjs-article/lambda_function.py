import redis
import boto3
import json
import pprint


SECRET_ID = 'redis'
REGION_NAME = 'us-west-1'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


# Get secrets
secret = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
host = secret['host']
port = secret['port']
password = secret['password']

# Connect to Redis
client_redis = redis.Redis(
    host=host,
    port=port,
    password=password,
    decode_responses=True
)


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if (
        'queryStringParameters' in event 
        and event['queryStringParameters'] is not None
        and 'id' in event['queryStringParameters']
    ):
        key = event['queryStringParameters']['id']
        
        # Like The Article action
        if 'action' in event['queryStringParameters']:
            client_redis.hincrby(key, 'like')
            likes = int(client_redis.hget(key, 'like'))
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'likes': likes })
            }
        
        # Increment view because a user accesses an individual article to read it
        client_redis.hincrby(key, 'view')
        
        # Find a single data
        keys = ['category', 'date', 'excerpt', 'image', 'is_featured', 'last_updated', 'like', 'slug', 'title', 'view', 'vote']
        values = client_redis.hmget(key, keys)
        article = {keys[i]: values[i] for i in range(len(keys))}
        article['id'] = key
        article['is_featured'] = int(article['is_featured']) if article['is_featured'] else 0
        article['view'] = int(article['view']) if article['view'] else 0
        article['vote'] = int(article['vote']) if article['vote'] else 0
        article['like'] = int(article['like']) if article['like'] else 0
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(article)
        }
        
    else:
        
        # Get article IDs by top score descending order
        keys = client_redis.zrevrange(
            name='score:',
            start=0,
            end=-1
        )
        
        # Get articles
        articles = []
        for key in keys:
            
            # HMGET gets a list of values for specified keys
            # Redis returns None in Python if a key in HASH does not exist
            keys = ['category', 'date', 'excerpt', 'image', 'is_featured', 'last_updated', 'like', 'slug', 'title', 'view', 'vote']
            values = client_redis.hmget(key, keys)
            article = {keys[i]: values[i] for i in range(len(keys))}
            article['id'] = key
            article['is_featured'] = int(article['is_featured']) if article['is_featured'] else 0
            article['view'] = int(article['view']) if article['view'] else 0
            article['vote'] = int(article['vote']) if article['vote'] else 0
            article['like'] = int(article['like']) if article['like'] else 0
            articles.append(article)
            
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(articles)
        }


if __name__ == '__main__':
    # event = {
    #     'queryStringParameters': {
    #     }
    # }
    # event = {
    #     'queryStringParameters': {
    #         'id': 'article:17'
    #     }
    # }
    event = {
        'queryStringParameters': {
            'id': 'article:17',
            'action': 'like'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
