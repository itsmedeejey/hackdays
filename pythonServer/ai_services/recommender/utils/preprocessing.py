# recommender/utils/preprocessing.py
import json
import os
import time
from recommender.api.ingestion import normalise_bulk, normalise

INTERNAL_PLACES_PATH = os.path.join(
    os.path.dirname(__file__), "../../data/places.json"
)
EMBEDDINGS_CACHE = os.path.join(
    os.path.dirname(__file__), "../../data/place_embeddings.pkl"
)

def bust_cache():
    if os.path.exists(EMBEDDINGS_CACHE):
        os.remove(EMBEDDINGS_CACHE)

def load_from_formatted_json(source_path: str) -> int:
    """One-time migration / manual reload from a JSON file. Keep for dev use."""
    with open(source_path) as f:
        raw = json.load(f)

    normalised = normalise_bulk(raw)

    with open(INTERNAL_PLACES_PATH, "w") as f:
        json.dump(normalised, f, indent=2, ensure_ascii=False)

    bust_cache()
    print(f"Loaded {len(normalised)} places → {INTERNAL_PLACES_PATH}")
    return len(normalised)

def load_internal_places() -> list[dict]:
    """Legacy: reads from places.json. Only used if DB is unavailable."""
    with open(INTERNAL_PLACES_PATH) as f:
        return json.load(f)

def load_from_db() -> list[dict]:
    """Live: fetch all posts from PostgreSQL and normalise into internal schema."""
    from psg_db import get_posts_from_db   # avoiding circular deps

    raw_posts = get_posts_from_db()
    normalised = []
    for post in raw_posts:
        try:
            normalised.append(_normalise_db_post(post))
        except Exception as e:
            print(f"Skipping post {post.get('id', '?')}: {e}")
            continue
    return normalised

def _normalise_db_post(post: dict) -> dict:
    """
    Map raw PostgreSQL Post row → internal place schema.
    Mirrors what normalise() in ingestion.py does for JSON payloads.
    """
    name        = post.get("title", "Untitled")
    description = post.get("description", "") or ""
    state       = post.get("state", "") or ""
    tags        = post.get("tags", []) or []

    return {
        "place_id":      post["id"],
        "user_id":       post.get("userId", ""),
        "name":          name,
        "description":   description,
        "post_type":     post.get("postType", "PLACE"),
        "state":         state,
        "created_at":    str(post.get("createdAt", "")),
        "images":        post.get("images", []),
        "types":         tags,
        "activities":    [],
        "budget_min":    0,
        "budget_max":    9999,
        # combined_text is what similarity.py reads for embeddings
        "combined_text": f"{name} {description} {state} {' '.join(tags)}".strip(),
    }