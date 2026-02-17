# 🕉️ Gita GPT: AI-Powered Spiritual Wisdom

**Gita GPT** is a full-stack, AI-driven spiritual companion built to provide guidance through the timeless teachings of the **Bhagavad Gita**. Utilizing a **Retrieval-Augmented Generation (RAG)** architecture, the application ensures that every response is factually grounded in sacred scripture, bridging the gap between ancient philosophy and modern Artificial Intelligence.


---

## ✨ Features

- **🧠 RAG-Driven Guidance:** Queries are processed through a semantic search engine to retrieve the most relevant verses before generating an AI response.
- **📚 Interactive Scripture Library:** Browse all 18 chapters and 700+ verses with a dedicated, high-performance reader.
- **🏛️ Modern Vedic UI:** A vibrant, responsive interface featuring parchment textures, saffron gradients, and glassmorphic navigation.
- **🕉️ Verse Modals:** Deep-dive into any verse with original Sanskrit, English translations, and detailed divine commentaries.
- **⚡ Real-time Stream:** Optimized for performance with a "thinking" state and smooth auto-scrolling conversation history.

---

## 🏗️ Technical Architecture & Design

### 1. The RAG Pipeline (The "Brain")
Gita GPT employs a sophisticated RAG (Retrieval-Augmented Generation) workflow to eliminate AI hallucinations:
- **Vector Embeddings:** Verses are transformed into high-dimensional vectors that capture semantic meaning.
- **Vector Search (ChromaDB):** When a user asks a question (e.g., "How to find peace?"), the system performs a mathematical "nearest neighbor" search in **ChromaDB**.
- **Context Injection:** The retrieved verses are fed into the **Hugging Face LLM** as a grounding context.
- **Grounded Generation:** The AI explains the retrieved wisdom in a compassionate, guru-like persona.



### 2. The Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | High-speed, state-driven user interface. |
| **Styling** | **Tailwind CSS** | Utility-first styling for the "Modern Vedic" aesthetic. |
| **Backend** | **FastAPI (Python)** | Asynchronous API for high-concurrency performance. |
| **Vector DB** | **ChromaDB** | Semantic storage and sub-millisecond retrieval. |
| **AI Model** | **Hugging Face** | Natural language processing and philosophical generation. |

### 3. Deployment & DevOps
- **Backend:** Hosted on **Render** (Python 3.11).
- **Frontend:** Hosted on **Vercel** with optimized Edge delivery.
- **Environment Management:** Secured via `.env` masking and Vercel/Render secret management.
- **CORS Policy:** Strict origin-based security to prevent unauthorized API consumption.

---

## 🛠️ Local Development

### 1. Prerequisites
- Python 3.11+
- Node.js & npm

### 2. Backend Setup
```bash
git clone [https://github.com/YOUR_USERNAME/gita-gpt.git](https://github.com/YOUR_USERNAME/gita-gpt.git)
cd gita-gpt
pip install -r requirements.txt
# Create a .env with HUGGINGFACEHUB_API_TOKEN
python -m app.main
