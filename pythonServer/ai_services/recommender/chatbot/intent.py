
RECOMMEND_SIGNALS = {
    "suggest", "recommend", "find", "show", "places", "where",
    "visit", "go", "travel", "destination", "best place",
    "top places", "nearby", "around", "in assam", "in meghalaya",
    "eco", "wildlife", "trek", "waterfall", "heritage", "cultural"
}

def is_recommendation_query(message: str) -> bool:
    tokens = set(message.lower().split())
    return bool(tokens & RECOMMEND_SIGNALS)

def extract_filters(message: str) -> dict:
    """
    Extract budget, state, month from natural language.
    Very lightweight — Claude handles the rest.
    """
    import re
    filters = {}
    msg = message.lower()

    budget_match = re.search(r'(?:under|below|less than|budget|within)\s*₹?\s*(\d+)', msg)
    if budget_match:
        filters["budget"] = int(budget_match.group(1))

    states = [
        "assam", "meghalaya", "nagaland", "manipur", "mizoram",
        "tripura", "arunachal pradesh", "sikkim"
    ]
    for state in states:
        if state in msg:
            filters["state"] = state.title()
            break

    months = {
        "january": "Jan", "february": "Feb", "march": "Mar",
        "april": "Apr", "may": "May", "june": "Jun",
        "july": "Jul", "august": "Aug", "september": "Sep",
        "october": "Oct", "november": "Nov", "december": "Dec"
    }
    for word, abbr in months.items():
        if word in msg or abbr.lower() in msg:
            filters["month"] = abbr
            break

    return filters
