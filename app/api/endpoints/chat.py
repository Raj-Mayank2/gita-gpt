from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import chromadb
import os
from app.services.llm_service import generate_gita_response

# Define what the user's request looks like
class ChatRequest(BaseModel):
    query: str

router = APIRouter()

# Initialize the Local Vector DB Connection
# Ensure this path matches where your ingestion script saved the data
DB_PATH = "./app/db/gita_db"
client = chromadb.PersistentClient(path=DB_PATH)
collection = client.get_collection(name="gita_knowledge")

# app/api/endpoints/chat.py
# ... (imports remain the same)

@router.post("/chat")
async def chat_with_gita(request: ChatRequest):
    try:
        # SEARCH: Retrieve top 2 verses
        results = collection.query(
            query_texts=[request.query],
            n_results=2
        )
        
        # New: Labeling the context so the AI doesn't get confused
        context_blocks = []
        for i in range(len(results['documents'][0])):
            doc = results['documents'][0][i]
            meta = results['metadatas'][0][i]
            
            # Explicitly labeling the source
            block = (
                f"--- SOURCE: Bhagavad Gita Verse {meta['chapter']}.{meta['verse']} ---\n"
                f"TEXT & COMMENTARY: {doc}\n"
                f"--- END OF SOURCE ---"
            )
            context_blocks.append(block)
        
        combined_context = "\n\n".join(context_blocks)
        
        # GENERATE
        answer = generate_gita_response(request.query, combined_context)
        
        return {
            "question": request.query,
            "answer": answer,
            "references": [f"BG {m['chapter']}.{m['verse']}" for m in results['metadatas'][0]]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail="The connection was interrupted.")