from fastapi import APIRouter, HTTPException
import chromadb
from app.core.config import settings

router = APIRouter()

# Connect to the local library (ChromaDB)
client = chromadb.PersistentClient(path=settings.DB_PATH)
collection = client.get_collection(name="gita_knowledge")

@router.get("/verse/{chapter}/{verse}")
async def get_specific_verse(chapter: int, verse: int):
    """
    Fetches the raw Sanskrit, translation, and commentary 
    for a specific verse without AI processing.
    """
    try:
        # Our unique ID format from ingestion: BG_2_2
        verse_id = f"BG_{chapter}_{verse}"
        
        # Pull direct data from the database
        result = collection.get(ids=[verse_id])
        
        if not result['documents']:
            raise HTTPException(
                status_code=404, 
                detail=f"Verse {chapter}.{verse} not found in the sacred texts."
            )

        # Return the data exactly as it is stored
        return {
            "chapter": chapter,
            "verse": verse,
            "data": result['documents'][0],
            "metadata": result['metadatas'][0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chapter/{chapter_num}")
async def get_chapter_summary(chapter_num: int):
    """
    Retrieves all verses or a summary of a specific chapter.
    """
    try:
        # Search metadata for all verses belonging to this chapter
        results = collection.get(
            where={"chapter": chapter_num}
        )
        
        if not results['ids']:
            raise HTTPException(status_code=404, detail="Chapter not found.")

        return {
            "chapter": chapter_num,
            "total_verses": len(results['ids']),
            "verses": results['metadatas']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))