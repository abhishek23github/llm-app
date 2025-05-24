from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    return jsonify({"response": f"[LOCAL MODEL] You Said: {prompt}"})

if __name__ == '__main__':
    app.run(port=5000)