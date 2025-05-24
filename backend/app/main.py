from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.llm_providers import get_llm_response

app = FastAPI()

# Allow frontend to connect 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    provider = data.get("provider", "openai")
    model = data.get("model", "gpt-3.5-turbo")	
    response = await get_llm_response(messages, provider, model)    
    return {"response": response}   

    