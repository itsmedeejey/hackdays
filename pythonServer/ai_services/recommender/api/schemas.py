from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    query: str = Field(..., min_length=2)
    budget: int | None = None
    month: str | None = None
    types: list[str] | None = None
    state: str | None = None
    top_k: int = Field(5, ge=1, le=20)

class MetadataResult(BaseModel):
    types: list[str]
    activities: list[str]
    budgetMin: int
    budgetMax: int

class PlaceResult(BaseModel):
    id: str
    userId: str
    title: str
    description: str
    postType: str
    state: str
    createdAt: str
    metadata: MetadataResult
    images: list[dict] = []
    final_score: float            # extra field so frontend can sort

class RecommendResponse(BaseModel):
    message: str
    query: str
    data: list[PlaceResult]
