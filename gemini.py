import google.generativeai as genai
from flask import Flask, request, jsonify
import time
from datetime import datetime
import os

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyCsn1zAZGI9N7fQvutvEEkoHrwg3t8icX4')
genai.configure(api_key=api_key)

# List all available models
print("Available models:")
for m in genai.list_models():
    print(f"Model: {m.name}")
    print(f"Supported methods: {m.supported_generation_methods}")
    print("---")

model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

app = Flask(__name__)

# Track last request time to implement rate limiting
last_request_time = 0
MIN_REQUEST_INTERVAL = 2  # Minimum seconds between requests

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Server is running"})

@app.route("/answer", methods=["POST"])
def answer():
    global last_request_time
    
    print("Received request to /answer endpoint")
    data = request.get_json()
    print(f"Received data: {data}")
    
    question = data.get("question", "")
    print(f"Question: {question}")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Implement rate limiting
    current_time = time.time()
    time_since_last_request = current_time - last_request_time
    if time_since_last_request < MIN_REQUEST_INTERVAL:
        wait_time = MIN_REQUEST_INTERVAL - time_since_last_request
        time.sleep(wait_time)
    
    try:
        # Updated prompt specifically for vocabulary questions
        prompt = f"""Given the vocabulary word: {question}
        What is the correct definition or synonym for this word?
        Respond with ONLY the correct answer, no explanations or additional text.
        The answer should be a single word or short phrase that best matches the meaning of the given word."""
        
        print("Attempting to generate response...")
        response = model.generate_content(prompt)
        print(f"Generated response: {response.text}")
        last_request_time = time.time()
        return jsonify({"answer": response.text.strip()})
    except Exception as e:
        error_message = str(e)
        print(f"Error occurred: {error_message}")
        
        # Handle rate limit errors specifically
        if "429" in error_message or "quota" in error_message.lower():
            return jsonify({
                "error": "Rate limit exceeded. Please try again in a few minutes.",
                "details": "The free tier of Gemini API has rate limits. Consider upgrading your plan or waiting before making more requests."
            }), 429
        else:
            return jsonify({"error": error_message}), 500

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=port)
