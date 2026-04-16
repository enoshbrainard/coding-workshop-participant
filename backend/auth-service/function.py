import json
import os
import bcrypt
import jwt
import psycopg
from psycopg.rows import dict_row

JWT_SECRET = os.environ.get("JWT_SECRET", "supersecret-placeholder")

# ✅ Common CORS headers
def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    }

def get_db():
    return psycopg.connect(
        host=os.environ.get("POSTGRES_HOST", os.environ.get("DB_HOST", "localhost")),
        dbname=os.environ.get("POSTGRES_NAME", os.environ.get("DB_NAME", "coding_workshop")),
        user=os.environ.get("POSTGRES_USER", os.environ.get("DB_USER", "postgres")),
        password=os.environ.get("POSTGRES_PASS", os.environ.get("DB_PASS", "postgres123")),
        port=os.environ.get("POSTGRES_PORT", "5432"),
        row_factory=dict_row
    )

def handler(event, context):
    path = event.get('path', '')
    http_method = event.get('httpMethod', '')

    # ✅ Handle preflight (VERY IMPORTANT)
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": ""
        }

    try:
        body_str = event.get('body')
        body = json.loads(body_str) if body_str else {}

        if http_method == 'POST' and path.endswith('/register'):
            return register(body)
        elif http_method == 'POST' and path.endswith('/login'):
            return login(body)
        else:
            return {
                "statusCode": 404,
                "headers": cors_headers(),
                "body": json.dumps({"message": "Not found"})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors_headers(),
            "body": json.dumps({"error": str(e)})
        }

def register(body):
    username = body.get('username')
    password = body.get('password')
    role = body.get('role', 'Employee')

    if not username or not password:
        return {
            "statusCode": 400,
            "headers": cors_headers(),
            "body": json.dumps({"message": "Missing credentials"})
        }

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s) RETURNING id",
                (username, hashed, role)
            )
            user_id = cur.fetchone()['id']
            conn.commit()

    return {
        "statusCode": 201,
        "headers": cors_headers(),
        "body": json.dumps({"message": "Created", "user_id": user_id})
    }

def login(body):
    username = body.get('username')
    password = body.get('password')

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, password_hash, role FROM users WHERE username = %s",
                (username,)
            )
            user = cur.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        token = jwt.encode(
            {'user_id': user['id'], 'role': user['role']},
            JWT_SECRET,
            algorithm='HS256'
        )

        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({"token": token, "role": user['role']})
        }

    return {
        "statusCode": 401,
        "headers": cors_headers(),
        "body": json.dumps({"message": "Invalid credentials"})
    }