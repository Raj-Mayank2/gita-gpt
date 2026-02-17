import os
from dotenv import load_dotenv

# Load the environment variables from your .env file
load_dotenv()

class Settings:
    """
    Centralized configuration for Gita GPT.
    Ensures the path to the Shastras and the AI tokens are managed in one place.
    """
    # 1. Path to your local ChromaDB (The Library)
    # Defaults to './app/db/gita_db' if not found in .env
    DB_PATH: str = os.getenv("DATABASE_PATH", "./app/db/gita_db")
    
    # 2. Your Hugging Face API Token (The Key to Wisdom)
    HF_TOKEN: str = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    
    # 3. Model Identifiers
    # We use Qwen-2.5 for its speed and compassion on free-tier CPUs
    LLM_MODEL: str = "Qwen/Qwen2.5-1.5B-Instruct"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # 4. Project Metadata
    PROJECT_NAME: str = "Gita GPT"
    VERSION: str = "1.1.0"

# Initialize the settings object for global use
settings = Settings()