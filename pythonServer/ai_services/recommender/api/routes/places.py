# recommender/api/routes/places.py
from fastapi import APIRouter, HTTPException
from recommender.utils.preprocessing import load_from_db
from recommender.model.similarity import invalidate_cache
import psycopg2, os

router = APIRouter()

def _conn():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

@router.get("/places")
def get_all_places():
    places = load_from_db()
    return {"total": len(places), "places": places}

@router.get("/places/{place_id}")
def get_place(place_id: str):
    places = load_from_db()
    match = next((p for p in places if p["place_id"] == place_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Place '{place_id}' not found")
    return match

@router.delete("/places/{place_id}")
def delete_place(place_id: str):
    conn = _conn()
    cur = conn.cursor()

    # check exists first
    cur.execute('SELECT id FROM "Post" WHERE id = %s', (place_id,))
    if not cur.fetchone():
        cur.close(); conn.close()
        raise HTTPException(status_code=404, detail=f"Place '{place_id}' not found")

    cur.execute('DELETE FROM "Post" WHERE id = %s', (place_id,))
    conn.commit()
    cur.close(); conn.close()

    invalidate_cache()  # rebuild without the deleted post

    return {"status": "deleted", "place_id": place_id}