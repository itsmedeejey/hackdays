# recommender/model/filters.py
import torch
from datetime import datetime

CURRENT_MONTH = datetime.now().strftime("%b")

def filter_candidates(
    places: list[dict],
    embeddings: torch.Tensor,
    budget=None,
    month=None,
    types=None,
    state=None,
) -> tuple[list[dict], torch.Tensor]:

    kept_places = []
    kept_indices = []

    for i, p in enumerate(places):
        best_months = p.get("best_months") or []

        if budget is not None:
            if not (p.get("budget_min", 0) <= budget <= p.get("budget_max", 9999)):
                continue

        if month is not None:
            if best_months and month not in best_months:
                continue

        if types is not None:
            place_types = p.get("types") or []
            if not any(t in place_types for t in types):
                continue

        if state is not None:
            place_state = (p.get("state") or "").lower().strip()
            if place_state and place_state != state.lower().strip():
                continue

        kept_places.append(p)
        kept_indices.append(i)

    if not kept_places:
        return places, embeddings

    filtered_embeddings = embeddings[kept_indices]
    return kept_places, filtered_embeddings