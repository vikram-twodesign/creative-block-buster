from flask import Flask, render_template, jsonify, request
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# After loading environment variables
if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please check your .env file.")
print("API Key loaded successfully")  # Debug log

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-prompt', methods=['GET'])
def generate_prompt():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a creative writing prompt generator. Generate unique, unexpected prompts that spark creativity. 
                    Rules:
                    - Never use common prompts like 'Write a letter to your future self'
                    - Keep prompts under 100 characters
                    - Focus on unusual scenarios, sensory details, or unexpected combinations
                    - Avoid clichés and overused writing exercises
                    - Make each prompt different from the last
                    - The task should take 5 minutes maximum
                    - Mix different genres: fantasy, sci-fi, reality, mystery
                    - Use varied writing forms: dialogue, description, scene-setting, character studies
                    
                    Examples of good prompts:
                    - "Describe a meal made entirely of colors"
                    - "Two strangers share an umbrella. One is not human"
                    - "The last tree on Earth just whispered something"
                    """
                },
                {"role": "user", "content": "Generate a creative writing prompt."}
            ],
            max_tokens=100,
            temperature=0.9
        )
        
        prompt = response.choices[0].message['content'].strip()
        return jsonify({"prompt": prompt})
    except Exception as e:
        print(f"Error generating prompt: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/submitForm', methods=['POST'])
def submit_form():
    try:
        data = request.get_json()
        text = data.get('text')
        prompt = data.get('prompt')
        
        # Here you can add your Google Form submission logic
        # For now, we'll just return success
        return jsonify({"message": "Submission successful"})
    except Exception as e:
        print(f"Form submission error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-response', methods=['POST'])
def analyze_response():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        user_response = data.get('text')
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an encouraging creative writing coach. Provide a brief, positive response (max 50 words) that acknowledges the writer's effort and creativity. Be specific but concise."
                },
                {
                    "role": "user",
                    "content": f"Prompt: {prompt}\nWriter's response: {user_response}"
                }
            ],
            max_tokens=75,
            temperature=0.7
        )
        
        feedback = response.choices[0].message['content'].strip()
        return jsonify({"feedback": feedback})
    except Exception as e:
        print(f"Error analyzing response: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
