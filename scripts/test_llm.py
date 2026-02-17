from app.services.llm_service import generate_gita_response

def test_brain():
    fake_question = "I am afraid of failing."
    fake_context = "Chapter 2.47: You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
    
    print("🧠 Sending data to Hugging Face...")
    answer = generate_gita_response(fake_question, fake_context)
    print("\n--- AI RESPONSE ---")
    print(answer)

if __name__ == "__main__":
    test_brain()