# recommender/model/similarity.py
from sentence_transformers import SentenceTransformer, util
import torch
import time

_model = SentenceTransformer("all-MiniLM-L6-v2")

# ── In-memory vector cache ──────────────────────────────────────────────────
_cache: dict = {
    "posts":          [],
    "embeddings":     None,   # torch.Tensor | None
    "last_refreshed": 0.0,
}
CACHE_TTL = 300  # seconds — auto-rebuild every 5 minutes

def invalidate_cache() -> None:
    """Force a rebuild on the next recommendation request."""
    _cache["last_refreshed"] = 0.0
    print("Vector cache invalidated.")

def get_cached_corpus() -> tuple[list[dict], torch.Tensor]:
    """
    Return (posts, embeddings).
    Rebuilds from PostgreSQL if cache is cold or TTL has expired.
    """
    from recommender.utils.preprocessing import load_from_db  # avoid circular import

    now = time.time()
    if _cache["embeddings"] is None or (now - _cache["last_refreshed"]) > CACHE_TTL:
        print("Rebuilding vector cache from DB...")
        posts = load_from_db()
        embeddings = build_place_corpus(posts)   # your existing function below
        _cache["posts"]          = posts
        _cache["embeddings"]     = embeddings
        _cache["last_refreshed"] = now
        print(f"Cache ready — {len(posts)} posts embedded.")
    return _cache["posts"], _cache["embeddings"]

# ── Original functions — unchanged ─────────────────────────────────────────

def build_place_corpus(places: list[dict]) -> torch.Tensor:
    texts = [place["combined_text"] for place in places]
    return _model.encode(texts, convert_to_tensor=True)

def compute_similarity(user_query: str, place_embeddings: torch.Tensor) -> list[float]:
    query_embedding = _model.encode(user_query, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, place_embeddings)[0]
    return scores.tolist()