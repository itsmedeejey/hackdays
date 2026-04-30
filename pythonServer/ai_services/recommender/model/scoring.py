def compute_eco_score(place):
    eco_type_weight = {
        "eco": 1.0, "nature": 0.8, "wildlife": 0.75,
        "adventure": 0.5, "cultural": 0.4,
        "historical": 0.3, "religious": 0.3, "heritage": 0.3, "leisure": 0.35
    }

    eco_activity_weight = {
        "bird watching": 1.0, "nature walk": 1.0,
        "trekking": 0.85, "cycling": 0.9,
        "camping": 0.75, "boating": 0.6,
        "safari": 0.5, "photography": 0.4
    }

    eco_keywords = {
        "eco": 1.0, "forest": 0.9, "rainforest": 1.0,
        "wildlife": 0.85, "biodiversity": 1.0,
        "conservation": 1.0, "river": 0.7,
        "lake": 0.7, "mountain": 0.7, "village": 0.6
    }

    type_scores = [
        eco_type_weight.get(t.lower(), 0.3)
        for t in place.get("types") or []
    ]
    # fallback 0.3 if no types (neutral score)
    type_score = sum(type_scores) / len(type_scores) if type_scores else 0.3

    activity_scores = [
        eco_activity_weight.get(a.lower(), 0.3)
        for a in place.get("activities") or []
    ]
    # fallback 0.3 if no activities
    activity_score = sum(activity_scores) / len(activity_scores) if activity_scores else 0.3

    text = (place.get("combined_text") or "").lower()
    keyword_hits = [
        weight for word, weight in eco_keywords.items()
        if word in text
    ]
    keyword_score = sum(keyword_hits) / len(keyword_hits) if keyword_hits else 0.3

    eco_score = (
        0.4 * type_score +
        0.3 * activity_score +
        0.3 * keyword_score
    )

    return round(eco_score * 100, 2)


def compute_popularity(place):
    base_popularity = {
        "Kaziranga National Park": 95,
        "Tawang": 90,
        "Cherrapunji (Sohra)": 92,
        "Dawki": 88,
        "Gangtok": 93,
        "Majuli": 85
    }

    base = base_popularity.get(place.get("name", ""), 60)

    remote_keywords = ["remote", "offbeat", "high-altitude", "hidden"]
    text = (place.get("combined_text") or "").lower()

    if any(k in text for k in remote_keywords):
        accessibility = 0.4
    elif "city" in text or "capital" in text:
        accessibility = 1.0
    else:
        accessibility = 0.7

    budget_min = place.get("budget_min", 0) or 0
    budget_max = place.get("budget_max", 9999) or 9999

    avg_budget = (budget_min + budget_max) / 2
    # clamp to [0, 1] — budget_max of 9999 was producing negative scores
    budget_score = max(0.0, min(1.0, 1 - (avg_budget / 10000)))

    popularity = (
        0.6 * base +
        0.2 * (accessibility * 100) +
        0.2 * (budget_score * 100)
    )

    return round(min(popularity, 100), 2)  # cap at 100