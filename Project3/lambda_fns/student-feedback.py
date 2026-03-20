import json


def lambda_handler(event, context):
    request_body_string = event.get('body')

    try:
        request_body = json.loads(request_body_string)

        # Now you can access specific data from the body
        # For example, if the body is '{"name": "test"}'
        name_value = request_body.get('name')
        feedback_type_value = request_body.get('feedbackType')
        feedback_text_value = request_body.get('feedbackText')

        # Note: Do not forget the CORS Header
        return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps(f"Successfully submitted feedback, Name:{name_value} | Feedback Type: {feedback_type_value} | Feedback Text: {feedback_text_value}")
        }
    except json.JSONDecodeError as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error reading body: Invalid JSON - {str(e)}")
        }
