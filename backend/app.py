# backend/app.py
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

API_KEYS = [
    os.getenv("GEMINI_KEY_1"),
    os.getenv("GEMINI_KEY_2"),
    os.getenv("GEMINI_KEY_3")
]
BACKEND_PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app)

GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def call_gemini_text(prompt: str):
    payload = {
        "contents": [{"parts":[{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1000,  # Much higher to avoid MAX_TOKENS
            "topK": 20,
            "topP": 0.8
        }
    }
    headers = {"Content-Type": "application/json"}
    
    for idx, key in enumerate(API_KEYS, 1):
        if not key:
            print(f"Key {idx}: EMPTY - skipping")
            continue
        try:
            print(f"Trying API key {idx}...")
            params = {"key": key}
            resp = requests.post(GEMINI_TEXT_URL, params=params, json=payload, headers=headers, timeout=8)
            print(f"Key {idx} - Status: {resp.status_code}")
            
            if resp.status_code == 200:
                data = resp.json()
                try:
                    # Check if we have content with parts
                    if "candidates" in data and len(data["candidates"]) > 0:
                        candidate = data["candidates"][0]
                        
                        # Handle MAX_TOKENS case - no actual content
                        if candidate.get("finishReason") == "MAX_TOKENS" and "parts" not in candidate.get("content", {}):
                            print(f"Key {idx} - MAX_TOKENS reached with no output, increasing limit...")
                            continue
                        
                        # Try to get text from parts
                        if "content" in candidate and "parts" in candidate["content"]:
                            text = candidate["content"]["parts"][0]["text"]
                            if text:
                                print(f"Key {idx} - SUCCESS!")
                                return {"success": True, "text": text}
                    
                    print(f"Key {idx} - No valid text in response")
                except Exception as e:
                    print(f"Key {idx} - Failed to parse response: {e}")
                    print(f"Response data: {data}")
            else:
                print(f"Key {idx} - Error {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"Key {idx} - Exception: {e}")
            continue
    return {"success": False, "error": "All API keys failed"}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        print("=== NEW REQUEST ===")
        data = request.get_json(force=True)
        print(f"Received data: {data}")
        text = data.get("text", "")
        print(f"Text length: {len(text)}")
        
        if not text or len(text.strip()) == 0:
            print("ERROR: No text provided")
            return jsonify({"success": False, "error": "No text"}), 400

        # Limit text length for faster processing (visible text only should be ~2000 chars)
        text = text[:5000]
        
        print(f"Processing text length: {len(text)}")
        print(f"Text preview: {text[:200]}")
        
        # Simple prompt - no markdown formatting
        prompt = f"Answer in plain text without any markdown, asterisks, or formatting:\n\n{text}\n\nAnswer:"

        print("Calling Gemini API...")
        result = call_gemini_text(prompt)
        print(f"Gemini result: {result}")
        
        if result["success"]:
            print("SUCCESS - Returning answer")
            return jsonify({"success": True, "answer": result["text"]})
        else:
            print(f"FAILED - Gemini error: {result.get('error')}")
            return jsonify({"success": False, "error": result.get("error")}), 500
    
    except Exception as e:
        print(f"ERROR in /analyze: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print(f"🚀 Backend starting on port {BACKEND_PORT}")
    app.run(host="0.0.0.0", port=BACKEND_PORT, debug=True)

