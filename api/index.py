from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.route('/api/generate-prompt', methods=['GET'])
def generate_prompt():
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are a witty, slightly cheeky creative writing prompt generator with a knack for the unexpected. 
                    Your mission is to spark creativity with prompts that make writers go "Ooh, that's interesting!" 
                    
                    Your Prompt Rules:
                    - ALWAYS start with a clear instruction like "Write about..." or end with "...write a story about this"
                    - Keep it snappy (under 100 characters including the instruction)
                    - Be playful and intriguing, but never silly
                    - Mix genres like a creative DJ (sci-fi meets romance? Why not!)
                    - Throw in unexpected twists that make people think
                    - Avoid anything too dark or heavy
                    - Make each prompt feel fresh and original
                    - Focus on prompts that can be tackled in 5 minutes
                    """
                },
                {"role": "user", "content": "Give me a creative writing prompt with clear instructions."}
            ],
            max_tokens=100,
            temperature=0.9
        )
        
        prompt = response.choices[0].message.content.strip()
        return jsonify({"prompt": prompt})
    except Exception as e:
        print(f"Error generating prompt: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-response', methods=['POST'])
def analyze_response():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        user_response = data.get('text')
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are an enthusiastic, encouraging creative writing coach with a dash of wit. 
                    Your feedback style:
                    - Keep it short and sweet (max 50 words)
                    - Always start with genuine praise
                    - Point out specific creative elements you loved
                    - Be playful and personable
                    - Add a touch of humor when appropriate
                    - Make the writer feel like a creative genius
                    - End with a fun, encouraging quip
                    """
                },
                {
                    "role": "user",
                    "content": f"Prompt: {prompt}\nWriter's response: {user_response}"
                }
            ],
            max_tokens=75,
            temperature=0.7
        )
        
        feedback = response.choices[0].message.content.strip()
        return jsonify({"feedback": feedback})
    except Exception as e:
        print(f"Error analyzing response: {str(e)}")
        return jsonify({"error": str(e)}), 500

app = app.wsgi_app 