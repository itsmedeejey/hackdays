# recommender/api/routes/recommend.py
from fastapi import APIRouter, HTTPException
from recommender.api.schemas import (
    RecommendRequest, RecommendResponse, PlaceResult, MetadataResult
)
from recommender.model.ranker import rank_places
from recommender.model.filters import filter_candidates
from recommender.model.similarity import get_cached_corpus   # ← only change at top

router = APIRouter()

@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    try:
        all_posts, all_embeddings = get_cached_corpus()   # ← both posts + tensor

        candidates, candidate_embeddings = filter_candidates(
            all_posts,
            all_embeddings,                               # ← pass tensor in
            budget=req.budget,
            month=req.month,
            types=req.types,
            state=req.state
        )

        ranked = rank_places(req.query, candidates, candidate_embeddings)  # ← pass tensor through
        top = ranked[:req.top_k]

        results = []
        for p in top:
            results.append(PlaceResult(
                id=p["place_id"],
                userId=p.get("user_id", ""),
                title=p["name"],
                description=p.get("description", ""),
                postType=p.get("post_type", "PLACE"),
                state=p.get("state", ""),
                createdAt=p.get("created_at", ""),
                metadata=MetadataResult(
                    types=p.get("types", []),
                    activities=p.get("activities", []),
                    budgetMin=p.get("budget_min", 0),
                    budgetMax=p.get("budget_max", 9999),
                ),
                images=p.get("images", []),
                final_score=round(p["final_score"], 4)
            ))

        return RecommendResponse(
            message="Recommendations fetched successfully",
            query=req.query,
            data=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))