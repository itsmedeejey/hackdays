

from recommender.model.scoring import compute_eco_score, compute_popularity
from recommender.model.similarity import compute_similarity



ECO_SIGNALS = {
    "eco", "sustainable", "green", "nature", "wildlife", "forest",
    "conservation", "bird", "trek", "camp", "organic", "village"
}
CULTURAL_SIGNALS = {
    "cultural", "heritage", "historical", "history", "ancient", "temple",
    "monastery", "festival", "tribe", "tradition", "museum", "palace",
    "monument", "ruins", "war", "kingdom", "pilgrimage"
}
ADVENTURE_SIGNALS = {
    "adventure", "trek", "rafting", "climb", "expedition", "offbeat",
    "remote", "extreme", "sport", "peak", "pass"
}
LEISURE_SIGNALS = {
    "relax", "leisure", "scenic", "view", "lake", "waterfall",
    "picnic", "resort", "photography", "sightseeing", "falls"
}

def detect_query_intent(query: str) -> dict:
    tokens = set(query.lower().split())

    scores = {
        "eco":       len(tokens & ECO_SIGNALS),
        "cultural":  len(tokens & CULTURAL_SIGNALS),
        "adventure": len(tokens & ADVENTURE_SIGNALS),
        "leisure":   len(tokens & LEISURE_SIGNALS),
    }

    dominant = max(scores, key=scores.get)
    has_signal = scores[dominant] > 0

    return {"dominant": dominant if has_signal else None, "scores": scores}


def get_weights(intent: dict) -> tuple[float, float, float]:
    """
    Returns (similarity_weight, eco_weight, popularity_weight).
    Similarity always dominates. Eco only matters for eco queries.
    """
    dominant = intent["dominant"]

    if dominant == "eco":
        return (0.60, 0.25, 0.15)   
    elif dominant == "cultural":
        return (0.75, 0.05, 0.20)   
    elif dominant == "adventure":
        return (0.70, 0.15, 0.15)
    elif dominant == "leisure":
        return (0.72, 0.08, 0.20)
    else:
        return (0.70, 0.15, 0.15)   



def enrich_places(places):
    for place in places:
        if "best_months" not in place:
            place["best_months"] = []
        place["eco_score"] = compute_eco_score(place)
        place["popularity"] = compute_popularity(place)
    return places


def compute_final_score(place, similarity, weights: tuple) -> float:
    ws, we, wp = weights
    return (
        similarity * ws +
        (place["eco_score"] / 100) * we +
        (place["popularity"] / 100) * wp
    )


def rank_places(user_query: str, places: list, place_embeddings=None) -> list:
    places = enrich_places(places)

    if place_embeddings is None:
        from recommender.model.similarity import build_place_corpus
        place_embeddings = build_place_corpus(places)
        
    similarities = compute_similarity(user_query, place_embeddings)
    TYPE_INTENT_MAP = {
    "cultural":  {"cultural", "historical", "religious", "heritage"},
    "eco":       {"eco", "nature", "wildlife"},
    "adventure": {"adventure", "nature"},
    "leisure":   {"leisure", "nature"},
    }

    def apply_type_boost(places, intent):
        dominant = intent["dominant"]
        if not dominant:
            return places
        relevant_types = TYPE_INTENT_MAP.get(dominant, set())
        for place in places:
            place_types = set(t.lower() for t in place["types"])
            if place_types & relevant_types:
                place["final_score"] += 0.03   
        return places

    intent = detect_query_intent(user_query)
    weights = get_weights(intent)


    print(f"[ranker] intent={intent['dominant']} weights=sim:{weights[0]} eco:{weights[1]} pop:{weights[2]}")

    for i, place in enumerate(places):
        place["similarity"] = similarities[i]
        place["final_score"] = compute_final_score(place, similarities[i], weights)

    places = apply_type_boost(places, intent)
    return sorted(places, key=lambda x: x["final_score"], reverse=True)