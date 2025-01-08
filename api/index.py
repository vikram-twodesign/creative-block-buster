from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
from openai import OpenAI
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, 
    static_url_path='',
    static_folder='static',
    template_folder='templates'  # Explicitly set template folder
)
CORS(app)

def get_openai_client():
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.error("OpenAI API key not found in environment variables")
        return None
    try:
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.openai.com/v1"
        )
        # Test the client
        logger.info("Testing OpenAI client connection...")
        test_response = client.models.list()
        logger.info("OpenAI client initialized successfully")
        return client
    except Exception as e:
        logger.error(f"Error creating OpenAI client: {str(e)}")
        return None

@app.route('/static/<path:path>')
def serve_static(path):
    try:
        if os.path.exists(os.path.join('static', path)):
            return send_from_directory('static', path)
        return f"File not found: {path}", 404
    except Exception as e:
        return str(e), 404

@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return str(e), 500

@app.route('/api/generate-prompt', methods=['GET'])
def generate_prompt():
    try:
        client = get_openai_client()
        if not client:
            error_msg = "OpenAI API not configured correctly. Please check the server logs."
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
        logger.info("Making request to OpenAI API...")
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
        logger.info(f"Successfully generated prompt: {prompt}")
        return jsonify({"prompt": prompt})
    except Exception as e:
        error_msg = f"Error generating prompt: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/analyze-response', methods=['POST'])
def analyze_response():
    try:
        client = get_openai_client()
        if not client:
            return jsonify({"error": "OpenAI API not configured. Please check your environment variables."}), 500
            
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        prompt = data.get('prompt')
        user_response = data.get('text')
        
        if not prompt or not user_response:
            return jsonify({"error": "Missing prompt or text in request"}), 400
        
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
        return jsonify({"error": str(e)}), 500 