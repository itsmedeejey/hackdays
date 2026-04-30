import uuid

MONTH_ALIASES = {
    "jan": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr",
    "may": "May", "jun": "Jun", "jul": "Jul", "aug": "Aug",
    "sep": "Sep", "oct": "Oct", "nov": "Nov", "dec": "Dec"
}

def normalise_months(months):
    return [MONTH_ALIASES.get(m.lower(), m) for m in (months or [])]

def normalise_types(types: list[str]) -> list[str]:
    """Lowercase all types and strip whitespace — handles mixed case from DB."""
    return [t.lower().strip() for t in (types or [])]

def normalise_activities(activities: list[str]) -> list[str]:
    """
    Strip trailing punctuation and lowercase.
    Handles both "safari" and "Visiting the State Museum." formats.
    """
    cleaned = []
    for a in (activities or []):
        a = a.strip().rstrip(".,;")
        if a:
            cleaned.append(a.lower())
    return cleaned

def build_combined_text(title, types, activities, description, state):
    type_phrases = {
        "eco":         "eco-tourism sustainable travel green destination",
        "wildlife":    "wildlife sanctuary animal spotting nature reserve",
        "cultural":    "cultural heritage local traditions indigenous community",
        "adventure":   "adventure activities outdoor exploration",
        "historical":  "historical heritage ancient monuments history",
        "religious":   "religious pilgrimage sacred site temple monastery",
        "spiritual":   "spiritual pilgrimage sacred monastery temple meditation",
        "nature":      "nature scenic landscape forest hills valley",
        "leisure":     "leisure relaxation sightseeing tourism",
        "heritage":    "historical heritage ancient monuments",
        "museum":      "museum exhibits history artifacts cultural",
        "landmark":    "landmark famous iconic attraction",
        "natural":     "nature scenic landscape forest waterfall",
        "educational": "educational learning research institute",
        "festive":     "festival celebration traditional culture",
        "traditional": "traditional culture indigenous local customs",
        "rural":       "rural village community lifestyle",
        "architectural": "architecture heritage monument design",
        "archaeological site": "archaeological ancient ruins excavation",
        "commerce hub": "market trade local commerce",
        "high-altitude heritage": "high altitude heritage mountain culture",
        "heritage village": "heritage village traditional community culture",
        "hill station": "hill station scenic mountain retreat",
        "trekking destination": "trekking hiking mountain trail adventure",
        "waterfall":   "waterfall cascade scenic water nature",
        "wildlife sanctuary": "wildlife sanctuary animal reserve nature",
        "botanical marvel": "botanical plants nature rare species",
        "high-altitude pass": "high altitude mountain pass scenic",
        "scenic":      "scenic beautiful landscape views",
        "infrastructure": "infrastructure landmark bridge road",
        "royal palace": "royal palace heritage historical architecture",
    }
    parts = [title, state or ""]
    for t in types:
        parts.append(type_phrases.get(t, t))
    if activities:
        parts.append("activities include " + ", ".join(activities))
    parts.append(description or "")
    return " ".join(filter(None, parts))

def normalise(payload: dict) -> dict:
    """
    Accepts a single entry from the flat DB array format.
    Uses the real DB 'id' directly.
    """
    meta        = payload.get("metadata") or {}
    types_raw   = normalise_types(meta.get("types", []))
    activities  = normalise_activities(meta.get("activities", []))
    months      = normalise_months(meta.get("months", []))
    state       = payload.get("state", "")
    title       = payload.get("title", "")
    description = payload.get("description", "")
    post_type   = payload.get("postType", "PLACE").upper()

    budget_min  = meta.get("budgetMin", 0) or 0
    budget_max  = meta.get("budgetMax", 9999) or 9999

    return {
        "place_id":      payload.get("id", str(uuid.uuid4())),  # use real DB id
        "user_id":       payload.get("userId", ""),
        "name":          title,
        "state":         state,
        "types":         types_raw,
        "activities":    activities,
        "description":   description,
        "budget_min":    budget_min,
        "budget_max":    budget_max,
        "best_months":   months,
        "location":      {},                 # not in this format
        "images":        payload.get("images", []),
        "post_type":     post_type,
        "user":          {"name": payload.get("userName", "ADMIN")},
        "combined_text": build_combined_text(
                            title, types_raw, activities, description, state
                         ),
        "created_at":    str(payload.get("createdAt", "")),
    }

def normalise_bulk(payload) -> list[dict]:
    """
    Accepts either:
    - A flat list: [{"id":...}, ...]
    - A wrapped dict: {"message":..., "data": [...]}
    """
    if isinstance(payload, list):
        entries = payload                       
    elif isinstance(payload, dict):
        entries = payload.get("data", [])        
    else:
        return []

    results = []
    for entry in entries:
        try:
            results.append(normalise(entry))
        except Exception as e:
            print(f"Skipping '{entry.get('title', '?')}': {e}")
    return results
