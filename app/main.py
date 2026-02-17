from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, gita # Import the new router
import uvicorn

import os

app = FastAPI(title="Gita GPT", version="1.1.0")


# Change this in your local code and push to GitHub
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://gita-gpt-xi.vercel.app" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registering both paths
app.include_router(chat.router, prefix="/api", tags=["Spiritual AI (Advice)"])
app.include_router(gita.router, prefix="/api", tags=["Gita Reference (Data)"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Chariot of Wisdom. Use /api/chat for guidance or /api/verse for study."}



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)