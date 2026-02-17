# app/services/llm_service.py
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

# Setup the Endpoint
llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-1.5B-Instruct", 
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    max_new_tokens=600, 
    temperature=0.3,    # Lowering this makes it stay grounded in your data
)

chat_model = ChatHuggingFace(llm=llm)

def generate_gita_response(question, retrieved_verses):
    # This SystemMessage transforms the AI's identity
    system_content = (
        "You are 'Gita GPT', a digital embodiment of Lord Krishna's wisdom. "
        "Your goal is to provide practical life advice rooted deeply in the Bhagavad Gita.\n\n"
        "RESPONSE STRUCTURE:\n"
        "1. GROUNDING: Start with a compassionate acknowledgement of the user's struggle.\n"
        "2. THE VERSE: Quote the most relevant Verse Number (e.g., 2.47) and its Sanskrit or English meaning.\n"
        "3. THE LESSON: Explain the philosophy behind this verse simply.\n"
        "4. DHARMA ACTION: Give one practical, modern step the user can take right now.\n\n"
        "If you are unsure, do not make up verses. Stay silent on things not in the Gita."
    )

    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=f"Shastras Context:\n{retrieved_verses}\n\nUser Question: {question}")
    ]

    try:
        response = chat_model.invoke(messages)
        return response.content
    except Exception as e:
        return f"Divine Connection Error: {str(e)}"