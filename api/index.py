from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import sys
import logging
import json

# Initialize Flask app with static files configuration
app = Flask(__name__, 
    static_url_path='',  # This will serve static files from the root URL
    static_folder='static'  # This points to the static folder
)
CORS(app)

# Enable debug logging
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)

# Initialize OpenAI client with error handling
def init_openai_client():
    try:
        # Log all environment variables (excluding the actual API key value)
        env_vars = {k: '***' if 'key' in k.lower() else v for k, v in os.environ.items()}
        app.logger.debug(f"Environment variables: {json.dumps(env_vars, indent=2)}")
        
        # Try different methods to get the API key
        api_key = None
        
        # Method 1: Direct environment variable
        api_key = os.environ.get('OPENAI_API_KEY')
        if api_key:
            app.logger.info("API key found in os.environ")
        
        # Method 2: Environment file
        if not api_key:
            app.logger.debug("Trying to load API key from .env file")
            load_dotenv()
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key:
                app.logger.info("API key found in .env file")
        
        # Method 3: Vercel environment
        if not api_key:
            app.logger.debug("Trying to load API key from VERCEL_ENV")
            vercel_env = os.environ.get('VERCEL_ENV')
            app.logger.debug(f"VERCEL_ENV: {vercel_env}")
            
            if vercel_env:
                api_key = os.environ.get('OPENAI_API_KEY')
                if api_key:
                    app.logger.info("API key found in Vercel environment")
        
        if not api_key:
            app.logger.error("No API key found in any location")
            return None
        
        # Try to initialize the client
        app.logger.debug("Attempting to initialize OpenAI client")
        client = OpenAI(api_key=api_key)
        
        # Test the client with a simple completion
        app.logger.debug("Testing OpenAI client with a simple request")
        test_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5
        )
        app.logger.info("OpenAI client initialized and tested successfully")
        return client
        
    except Exception as e:
        app.logger.error(f"Error initializing OpenAI client: {str(e)}")
        return None

# Initialize the client
client = init_openai_client()

@app.route('/api/test-openai', methods=['GET'])
def test_openai():
    """Test endpoint to check OpenAI configuration"""
    try:
        if not client:
            return jsonify({
                "status": "error",
                "message": "OpenAI client not initialized",
                "env_vars": {k: '***' if 'key' in k.lower() else v for k, v in os.environ.items()}
            }), 500
            
        test_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5
        )
        return jsonify({
            "status": "success",
            "message": "OpenAI client working",
            "test_response": str(test_response)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "env_vars": {k: '***' if 'key' in k.lower() else v for k, v in os.environ.items()}
        }), 500

@app.route('/static/<path:path>')
def serve_static(path):
    try:
        app.logger.debug(f"Serving static file: {path}")
        if os.path.exists(os.path.join('static', path)):
            return send_from_directory('static', path)
        else:
            app.logger.error(f"Static file not found: {path}")
            return f"File not found: {path}", 404
    except Exception as e:
        app.logger.error(f"Error serving static file {path}: {str(e)}")
        return str(e), 404

@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        app.logger.error(f"Error rendering template: {str(e)}")
        return str(e), 500

@app.route('/api/generate-prompt', methods=['GET'])
def generate_prompt():
    try:
        if not client:
            error_msg = "OpenAI API not configured. Please check your environment variables."
            app.logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
        app.logger.debug("Generating prompt with OpenAI API")
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
        app.logger.debug(f"Generated prompt: {prompt}")
        return jsonify({"prompt": prompt})
    except Exception as e:
        error_msg = f"Error generating prompt: {str(e)}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/analyze-response', methods=['POST'])
def analyze_response():
    try:
        if not client:
            error_msg = "OpenAI API not configured. Please check your environment variables."
            app.logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data received")
            
        prompt = data.get('prompt')
        user_response = data.get('text')
        
        if not prompt or not user_response:
            raise ValueError("Missing prompt or text in request")
        
        app.logger.debug("Analyzing response with OpenAI API")
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
        app.logger.debug(f"Generated feedback: {feedback}")
        return jsonify({"feedback": feedback})
    except Exception as e:
        error_msg = f"Error analyzing response: {str(e)}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 500 