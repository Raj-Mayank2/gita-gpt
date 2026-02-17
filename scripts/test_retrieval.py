import chromadb
from langchain_huggingface import HuggingFaceEmbeddings

# 1. Initialize the same embedding model
embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 2. Connect to the DB we just created
client = chromadb.PersistentClient(path="./app/db/gita_db")
collection = client.get_collection(name="gita_knowledge")

def ask_gita_local(query):
    print(f"\n🤔 User Question: {query}")
    
    # Search for top 3 relevant verses
    results = collection.query(
        query_texts=[query], # ChromaDB can handle the embedding internally if set up, or we pass query_texts
        n_results=3
    )

    print("\n📜 Relevant Verses Found:")
    for i in range(len(results['documents'][0])):
        verse_text = results['documents'][0][i]
        metadata = results['metadatas'][0][i]
        print(f"\n--- Verse {metadata['chapter']}.{metadata['verse']} ---")
        # Print just the first 300 characters to verify
        print(verse_text[:300] + "...")

if __name__ == "__main__":
    # Test with a specific life problem
    ask_gita_local("I am feeling very confused about my career and duty. What should I do?")