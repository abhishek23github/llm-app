# Script to test Hugging Face API key validity
import requests

HUGGINGFACE_API_KEY = "your_huggingface_api_key_here"  # Replace with your actual key

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
}

def test_huggingface_api_key():
    url = "https://api-inference.huggingface.co/models"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("API key is valid! Access granted.")
    elif response.status_code == 401:
        print("Invalid API key. Access denied.")
    else:
        print(f"Unexpected response: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_huggingface_api_key()
