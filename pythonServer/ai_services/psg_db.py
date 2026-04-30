# psg_db.py
import psycopg2
import os

def get_posts_from_db() -> list[dict]:
    """Fetch all posts from PostgreSQL and return as list of dicts."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL not set in environment")

    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()

    cursor.execute('''
        SELECT *
        FROM "Post"
        ORDER BY "createdAt" DESC;
    ''')

    colnames = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [dict(zip(colnames, row)) for row in rows]



    