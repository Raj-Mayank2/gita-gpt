import os
import json
import chromadb
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize Local Vector DB (Runs on your CPU)
# This creates a folder 'app/db/gita_db' to store the processed data
client = chromadb.PersistentClient(path="./app/db/gita_db")
collection = client.get_or_create_collection(name="gita_knowledge")

# 2. Free Embedding Model (Lightweight & runs on CPU)
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def load_chapters():
    """Maps chapter numbers to their summaries for context."""
    chapters_dir = "data/Bhagwat-Gita-Infinity/chapters"
    chapter_map = {}
    
    for file in os.listdir(chapters_dir):
        if file.endswith(".json"):
            with open(os.path.join(chapters_dir, file), "r", encoding="utf-8") as f:
                data = json.load(f)
                chapter_map[data["chapter_number"]] = data["summary"]["en"]
    return chapter_map

def ingest_sloks():
    chapter_summaries = load_chapters()
    sloks_dir = "data/Bhagwat-Gita-Infinity/sloks"
    
    print("⏳ Starting Ingestion... This will take a few minutes on CPU.")
    
    for filename in os.listdir(sloks_dir):
        if filename.endswith(".json"):
            with open(os.path.join(sloks_dir, filename), "r", encoding="utf-8") as f:
                data = json.load(f)
                
                # Handling your specific JSON keys
                ch = data.get("chapter")
                vr = data.get("verse")
                sanskrit = data.get("slok", "")
                
                # We prioritize Sivananda & Prabhupada for English context
                # Using .get() to handle the "schema variations" you mentioned safely
                siva_trans = data.get("siva", {}).get("et", "No translation")
                prabhu_comm = data.get("prabhu", {}).get("ec", "No commentary")
                ch_summary = chapter_summaries.get(ch, "")

                # Combine into a "Rich Context" for the AI
                rich_context = (
                    f"Chapter {ch} Context: {ch_summary}\n"
                    f"Verse {ch}.{vr}: {sanskrit}\n"
                    f"English Meaning: {siva_trans}\n"
                    f"Deep Explanation: {prabhu_comm}"
                )

                # Generate the vector and add to DB
                # Note: ChromaDB handles the list of docs/ids
                collection.add(
                    documents=[rich_context],
                    ids=[f"BG_{ch}_{vr}"],
                    metadatas=[{"chapter": ch, "verse": vr}]
                )
                
    print(f"✅ Successfully indexed {collection.count()} verses into ChromaDB!")

if __name__ == "__main__":
    ingest_sloks()