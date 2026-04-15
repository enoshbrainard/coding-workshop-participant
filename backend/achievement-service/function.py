import json
import os
import psycopg
import jwt
from psycopg.rows import dict_row

JWT_SECRET = os.environ.get("JWT_SECRET", "supersecret-placeholder")

def get_db():
    return psycopg.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        dbname=os.environ.get("DB_NAME", "postgres"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASS", "postgres"),
        row_factory=dict_row
    )

def authorize(event):
    headers = event.get('headers', {})
    auth_header = headers.get('Authorization', '') or headers.get('authorization', '')
    if not auth_header.startswith('Bearer '):
        raise Exception("Unauthorized")
    token = auth_header.split(' ')[1]
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])

def handler(event, context):
    try:
        user = authorize(event)
    except Exception as e:
        return {"statusCode": 401, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"message": "Unauthorized"})}
    
    http_method = event.get('httpMethod', '')
    
    try:
        if http_method == 'GET':
            return get_achievements()
        elif http_method == 'POST':
            if user.get('role') == 'Employee':
                return {"statusCode": 403, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"message": "Forbidden"})}
            body_str = event.get('body')
            body = json.loads(body_str) if body_str else {}
            return create_achievement(body)
        else:
            return {"statusCode": 405}
    except Exception as e:
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": str(e)})}

def get_achievements():
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM achievements")
            achvs = cur.fetchall()
    return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps(achvs)}

def create_achievement(body):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO achievements (team_id, title, description, month) VALUES (%s, %s, %s, %s) RETURNING id",
                (body.get('team_id'), body.get('title'), body.get('description'), body.get('month'))
            )
            a_id = cur.fetchone()['id']
            conn.commit()
    return {"statusCode": 201, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"id": a_id})}
