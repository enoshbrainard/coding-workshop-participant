import json
import os
import psycopg
import jwt
from psycopg.rows import dict_row

JWT_SECRET = os.environ.get("JWT_SECRET", "supersecret-placeholder")

# ✅ CORS headers
def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    }

def get_db():
    return psycopg.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        dbname=os.environ.get("DB_NAME", "coding_workshop"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "postgres123"),
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
    http_method = event.get('httpMethod', '')

    # ✅ Handle OPTIONS (CORS preflight)
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": ""
        }

    try:
        user = authorize(event)
    except Exception:
        return {
            "statusCode": 401,
            "headers": cors_headers(),
            "body": json.dumps({"message": "Unauthorized"})
        }

    try:
        if http_method == 'GET':
            return get_achievements()

        elif http_method == 'POST':
            if user.get('role') == 'Employee':
                return {
                    "statusCode": 403,
                    "headers": cors_headers(),
                    "body": json.dumps({"message": "Forbidden"})
                }

            body_str = event.get('body')
            body = json.loads(body_str) if body_str else {}
            return create_achievement(body)

        else:
            return {
                "statusCode": 405,
                "headers": cors_headers(),
                "body": json.dumps({"message": "Method not allowed"})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors_headers(),
            "body": json.dumps({"error": str(e)})
        }

def get_achievements():
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM achievements")
            achvs = cur.fetchall()

    return {
        "statusCode": 200,
        "headers": cors_headers(),
        "body": json.dumps(achvs)
    }

def create_achievement(body):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO achievements (team_id, title, description, month) VALUES (%s, %s, %s, %s) RETURNING id",
                (body.get('team_id'), body.get('title'), body.get('description'), body.get('month'))
            )
            a_id = cur.fetchone()['id']
            conn.commit()

    return {
        "statusCode": 201,
        "headers": cors_headers(),
        "body": json.dumps({"id": a_id})
    }