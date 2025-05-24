# 🤖 LLM App — OpenAI + Local (Ollama) Chatbot

This is a full-stack chatbot app that supports:

- 🧠 **OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo)**
- 🖥️ **Local LLMs via [Ollama](https://ollama.com)**
- 💬 Markdown + syntax-highlighted responses
- 💬 Bubble-style chat UI with copyable code blocks
- 🎛 Model + provider selection
- 🗂 Sidebar chat history with delete & new chat
- 🖱 One-click `.bat` launcher for full stack

## 🏗 Folder Structure

```
llm-app/
├── backend/               # FastAPI backend
│   ├── app/               # Includes main.py, llm_providers.py
│   ├── venv/              # Python virtual environment
│   └── .env               # Contains OpenAI + Hugging Face API keys
├── frontend/              # React UI
├── local_model_server.py  # (Optional) Flask mock server
├── start_llm_app.bat      # 🖱 One-click launcher (3 terminals)
```

## ⚙ Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Ollama (for local LLMs) → https://ollama.com/download
- [OpenAI API key](https://platform.openai.com/account/api-keys)

## 🧪 Setup Instructions

### 🔹 1. Clone the Repo

```bash
git clone https://github.com/your-username/llm-app.git
cd llm-app
```

### 🔹 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # use source venv/bin/activate on Mac/Linux
pip install -r requirements.txt
```

Create a `.env` in `backend/`:

```
OPENAI_API_KEY=your-openai-key
HF_API_KEY=your-huggingface-key  # optional
```

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
```

### 🔹 4. Ollama Setup

```bash
ollama run llama2
```

Or preload other models:

```bash
ollama pull mistral
ollama pull gemma
```

### 🖱 5. Launch the App (One click)

Just double-click:

```
start_llm_app.bat
```

It will:
- Run FastAPI backend
- Start local model
- Open React frontend

## 🧠 Features

- ✅ Model selection (OpenAI / Local)
- ✅ Markdown + syntax-highlighted answers
- ✅ Bubble chat UI with "Copy" buttons
- ✅ Chat history + delete + new chat
- ✅ Dark mode
- ✅ Typing animation (`⠋⠙⠹...`)
- ✅ Local model via Ollama (real-time inference)

## 🧱 Coming Next (Optional Ideas)

- 🔁 Real-time streaming responses from Ollama
- 💾 Export chat to Markdown/Text
- 📊 Token usage & cost tracking
- 🌍 Deploy to Vercel + Render (for OpenAI only mode)
