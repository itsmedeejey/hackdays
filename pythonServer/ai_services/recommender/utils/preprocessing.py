# recommender/utils/preprocessing.py
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../"))

def load_from_db() -> list[dict]:
    """Live: fetch all posts from PostgreSQL and normalise into internal schema."""
    from psg_db import get_posts_from_db

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
        "combined_text": f"{name} {description} {state} {' '.join(tags)}".strip(),
    }
