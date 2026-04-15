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
        # ✅ Analytics routes
        if path.endswith('/analytics/non-direct-staff') and http_method == 'GET':
            return get_non_direct_staff()

        elif path.endswith('/analytics/high-non-direct-teams') and http_method == 'GET':
            return get_high_non_direct_teams()

        elif path.endswith('/analytics/org-leader-teams') and http_method == 'GET':
            return get_org_leader_teams()

        # ✅ CRUD
        if http_method == 'GET':
            return get_members()

        elif http_method == 'POST':
            if user.get('role') == 'Employee':
                return {
                    "statusCode": 403,
                    "headers": cors_headers(),
                    "body": json.dumps({"message": "Forbidden"})
                }

            body_str = event.get('body')
            body = json.loads(body_str) if body_str else {}
            return create_member(body)

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

def get_members():
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM members")
            members = cur.fetchall()

    return {
        "statusCode": 200,
        "headers": cors_headers(),
        "body": json.dumps(members)
    }

def create_member(body):
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO members (name, role, team_id, manager_id) VALUES (%s, %s, %s, %s) RETURNING id",
                (body.get('name'), body.get('role'), body.get('team_id'), body.get('manager_id'))
            )
            member_id = cur.fetchone()['id']
            conn.commit()

    return {
        "statusCode": 201,
        "headers": cors_headers(),
        "body": json.dumps({"id": member_id})
    }

def get_non_direct_staff():
    query = """
    SELECT m.name, t.name as team_name, m.manager_id, t.leader_id
    FROM members m
    JOIN teams t ON m.team_id = t.id
    WHERE m.manager_id != t.leader_id OR (m.manager_id IS NULL AND t.leader_id IS NOT NULL)
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

def get_high_non_direct_teams():
    query = """
    WITH team_stats AS (
        SELECT t.id, t.name, 
               COUNT(m.id) as total_members,
               SUM(CASE WHEN m.manager_id != t.leader_id THEN 1 ELSE 0 END) as non_direct_count
        FROM teams t
        JOIN members m ON t.id = m.team_id
        GROUP BY t.id, t.name
    )
    SELECT * FROM team_stats WHERE total_members > 0 AND (non_direct_count * 1.0 / total_members) > 0.20
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

def get_org_leader_teams():
    query = """
    SELECT t.name as team_name, m.name as leader_name
    FROM teams t
    JOIN members m ON t.leader_id = m.id
    WHERE m.manager_id IS NULL OR m.role = 'Director'
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