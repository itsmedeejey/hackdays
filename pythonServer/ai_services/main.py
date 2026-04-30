# main.py
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender.api.routes import recommend, places, ingest, chat
from recommender.model.similarity import get_cached_corpus, invalidate_cache

app = FastAPI(title="Eco Tourism Recommender API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router,      tags=["Chatbot"])
app.include_router(recommend.router, tags=["Recommendations"])
app.include_router(places.router,    tags=["Places"])
app.include_router(ingest.router,    tags=["Ingestion"])

@app.on_event("startup")
def startup():
    # Warm the cache from DB on boot — no JSON file needed
    posts, embeddings = get_cached_corpus()
    print(f"Server ready. {len(posts)} posts loaded from DB.")

@app.post("/refresh-cache")
def refresh_cache():
    """Node.js calls this after every new Post is created via Prisma."""
    invalidate_cache()
    return {"status": "cache invalidated"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "recommender"}