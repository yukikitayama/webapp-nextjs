import pprint


def lambda_handler(event, context):
    
    print('event')
    pprint.pprint(event)
