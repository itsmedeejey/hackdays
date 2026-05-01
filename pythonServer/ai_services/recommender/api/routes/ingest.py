# recommender/api/routes/ingest.py
from fastapi import APIRouter, HTTPException
from recommender.api.ingestion import normalise
from recommender.model.similarity import invalidate_cache
import psycopg2, os, json

router = APIRouter()

def _conn():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def post_exists(place_id: str) -> bool:
    conn = _conn()
    cur = conn.cursor()
    cur.execute('SELECT 1 FROM "Post" WHERE id = %s', (place_id,))
    exists = cur.fetchone() is not None
    cur.close(); conn.close()
    return exists

@router.post("/ingest", status_code=201)
def ingest(payload: dict):
    try:
        normalised = normalise(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=422, detail=f"Missing field: {e}")

    if post_exists(normalised["place_id"]):
        raise HTTPException(
            status_code=409,
            detail=f"Post ID {normalised['place_id']} already exists"
        )

    # Invalidate in-memory vector cache so next recommendation
    # request rebuilds with this new post included
    invalidate_cache()

    return {
        "status": "ok",
        "place_id": normalised["place_id"],
        "name": normalised["name"],
        "post_type": normalised["post_type"]
    }