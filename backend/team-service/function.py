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
        host=os.environ.get("POSTGRES_HOST", os.environ.get("DB_HOST", "localhost")),
        dbname=os.environ.get("POSTGRES_NAME", os.environ.get("DB_NAME", "coding_workshop")),
        user=os.environ.get("POSTGRES_USER", os.environ.get("DB_USER", "postgres")),
        password=os.environ.get("POSTGRES_PASS", os.environ.get("DB_PASS", "postgres123")),
        port=os.environ.get("POSTGRES_PORT", "5432"),
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
    path = event.get('path', '')

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
        # ✅ Analytics
        if path.endswith('/analytics/not-colocated') and http_method == 'GET':
            return get_not_colocated_leaders()

        # ✅ CRUD
        if http_method == 'GET':
            return get_teams()

        elif http_method == 'POST':
            if user.get('role') == 'Employee':
                return {
                    "statusCode": 403,
                    "headers": cors_headers(),
                    "body": json.dumps({"message": "Forbidden"})
                }

            body_str = event.get('body')
            body = json.loads(body_str) if body_str else {}
            return create_team(body)

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

def get_teams():
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM teams")
            teams = cur.fetchall()

    return {
        "statusCode": 200,
        "headers": cors_headers(),
        "body": json.dumps(teams)
    }

def create_team(body):
    name = body.get('name')
    location = body.get('location')
    leader_id = body.get('leader_id')

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO teams (name, location, leader_id) VALUES (%s, %s, %s) RETURNING id",
                (name, location, leader_id)
            )
            team_id = cur.fetchone()['id']
            conn.commit()

    return {
        "statusCode": 201,
        "headers": cors_headers(),
        "body": json.dumps({"id": team_id})
    }

def get_not_colocated_leaders():
    query = """
    SELECT t.name as team_name, t.location as team_location, 
           m.name as leader_name, leader_team.location as leader_location
    FROM teams t
    JOIN members m ON t.leader_id = m.id
    JOIN teams leader_team ON m.team_id = leader_team.id
    WHERE t.location != leader_team.location
    """

    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            results = cur.fetchall()

    return {
        "statusCode": 200,
        "headers": cors_headers(),
        "body": json.dumps(results)
    }