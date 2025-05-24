import os 
import httpx
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

async def get_llm_response(messages, provider="openai", model = "gpt-3.5-turbo"):
    if provider == "openai":
        return await openai_chat(messages, model)
    
    elif provider == "huggingface":
        return await huggingface_chat(messages, model)  

    elif provider == "local":
        return await local_model_chat(messages)
        
    return "Provider not supported"

async def openai_chat(messages, model = "gpt-3.5-turbo"):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model, 
        "messages": messages
        }

    print("==== PAYLOAD SENT TO OPENAI====")
    print(payload)
    print("===================")

    try: 
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    
    except httpx.ReadTimeout:
        return "Error: OpenAI API request timed out. Please try again"
    except Exception as e:
        return f"Unexpected Error: {str(e)}"

async def huggingface_chat(messages, model = "google/flan-t5-small"):
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"  
    }
    payload = {
        "inputs": messages[-1]["content"],
    }      

    async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, headers=headers, json=payload)

            #bunch of logging statements 
            print(f"HF status code: {resp.status_code}")
            print(f"HF headers: {resp.headers}")
            print(f"HF request url: {url}")
            print(f"HF request payload: {payload}")
            print(f"HF response: {resp.text}")

            resp.raise_for_status()
            data = resp.json()
        
            #handle if response is list (common)
            if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                return data[0]["generated_text"]
        
            elif isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"]
        
            else:
                return "⚠ HF API response not understood"
                

async def local_model_chat(messages):
    prompt = messages[-1]["content"]

    payload = {
        "model": "llama2",
        "prompt": prompt
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post("http://localhost:11434/api/generate", json=payload)
        resp.raise_for_status()
        stream = resp.json()

        return stream.get("response", "[No response from local LLM]")
