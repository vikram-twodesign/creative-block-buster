from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(debug=True, host='0.0.0.0', port=8000)
    print("Flask application has stopped.")
