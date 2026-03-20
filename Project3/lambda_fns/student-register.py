import json


def lambda_handler(event, context):
    request_body_string = event.get('body')

    try:
        request_body = json.loads(request_body_string)

        # Now you can access specific data from the body
        # For example, if the body is '{"name": "test"}'
        name_value = request_body.get('name')
        email_value = request_body.get('email')
        studentId_value = request_body.get('studentId')
        branchYear_value = request_body.get('branchYear')

        # Note: Do not forget the CORS Header
        return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps(f"Successfully registered for, Name:{name_value} | Email: {email_value} | StudentRollNo.: {studentId_value} | Branch/Year: {branchYear_value}")
        }
    except json.JSONDecodeError as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error reading body: Invalid JSON - {str(e)}")
        }
