import json
import boto3
import os
import logging
from datetime import datetime
from boto3.dynamodb.conditions import Key

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

# CORS headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://d8htopjtosdwq.cloudfront.net',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
}

def lambda_handler(event, context):
    # Log the full event for debugging
    logger.info("Full event received: %s", json.dumps(event))
    if 'requestContext' in event:
        logger.info("requestContext: %s", json.dumps(event['requestContext']))
        if 'authorizer' in event['requestContext']:
            logger.info("authorizer: %s", json.dumps(event['requestContext']['authorizer']))
    
    # Handle CORS preflight requests
    if event.get('httpMethod') == 'OPTIONS':
        logger.info('Handling OPTIONS request')
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': ''
        }
    
    try:
        # Log request context and headers
        logger.info('Request context: %s', json.dumps(event.get('requestContext', {}), default=str))
        logger.info('Request headers: %s', json.dumps(event.get('headers', {}), default=str))
        
        # Get user ID from Cognito authorizer
        if 'authorizer' not in event.get('requestContext', {}):
            logger.error('No authorizer found in request context. Full context: %s', 
                        json.dumps(event.get('requestContext', {}), default=str))
            return {
                'statusCode': 401,
                'headers': CORS_HEADERS,
                'body': json.dumps({
                    'error': 'Unauthorized - No authorizer found',
                    'details': 'Missing authorizer in request context'
                })
            }
            
        user_id = event['requestContext']['authorizer']['claims']['sub']
        logger.info('User ID from authorizer: %s', user_id)
        
        if event.get('httpMethod') == 'POST':
            # Create new log entry
            logger.info('Processing POST request for new log entry')
            if not event.get('body'):
                logger.error('No body found in request')
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'error': 'No request body provided',
                        'details': 'Request body is required'
                    })
                }
                
            try:
                body = json.loads(event['body'])
                logger.info('Parsed request body: %s', json.dumps(body, default=str))
            except json.JSONDecodeError as e:
                logger.error('Invalid JSON in request body: %s', str(e))
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'error': 'Invalid JSON in request body',
                        'details': str(e)
                    })
                }
                
            # Validate required fields
            if not body.get('productivity') or not body.get('feedback'):
                logger.error('Missing required fields: productivity=%s, feedback=%s', 
                           body.get('productivity'), body.get('feedback'))
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'error': 'Productivity level and feedback are required',
                        'details': 'Please provide both productivity level and feedback'
                    })
                }
            
            # Create log entry
            log_entry = {
                'userId': user_id,
                'timestamp': datetime.utcnow().isoformat(),
                'productivity': body['productivity'],
                'feedback': body['feedback'],
                'blockers': body.get('blockers', '')
            }
            
            logger.info('Attempting to create log entry: %s', json.dumps(log_entry, default=str))
            try:
                table.put_item(Item=log_entry)
                logger.info('Successfully created log entry in DynamoDB')
                return {
                    'statusCode': 201,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'message': 'Log entry created successfully',
                        'log': log_entry
                    })
                }
            except Exception as e:
                logger.error('Error creating log entry in DynamoDB: %s', str(e), exc_info=True)
                return {
                    'statusCode': 500,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'error': 'Failed to create log entry',
                        'message': str(e),
                        'details': 'Database operation failed'
                    })
                }
            
        elif event.get('httpMethod') == 'GET':
            # Get user's logs
            logger.info('Fetching logs for user: %s', user_id)
            try:
                # Log the query parameters
                logger.info('Querying DynamoDB with userId: %s', user_id)
                response = table.query(
                    KeyConditionExpression=Key('userId').eq(user_id),
                    ScanIndexForward=False  # Sort in descending order (newest first)
                )
                logger.info('DynamoDB response: %s', json.dumps(response, default=str))
                
                if not response.get('Items'):
                    logger.info('No logs found for user: %s', user_id)
                    return {
                        'statusCode': 200,
                        'headers': CORS_HEADERS,
                        'body': json.dumps({
                            'logs': [],
                            'message': 'No logs found'
                        })
                    }
                
                logger.info('Successfully fetched %d logs for user %s', 
                          len(response['Items']), user_id)
                
                return {
                    'statusCode': 200,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'logs': response['Items'],
                        'message': 'Logs retrieved successfully'
                    })
                }
            except Exception as e:
                logger.error('Error fetching logs from DynamoDB: %s', str(e), exc_info=True)
                return {
                    'statusCode': 500,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'error': 'Failed to fetch logs',
                        'message': str(e),
                        'details': 'Database query failed'
                    })
                }
            
    except Exception as e:
        logger.error('Unexpected error in lambda_handler: %s', str(e), exc_info=True)
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e),
                'details': 'Unexpected error occurred'
            })
        } 