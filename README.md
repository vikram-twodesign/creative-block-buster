# Creative Block Buster

An AI-powered creative writing prompt generator that helps you overcome writer's block and unleash your creativity.

## Features

- AI-generated creative writing prompts
- 5-minute writing timer
- AI-powered feedback on your writing
- Share your creations
- Dark mode support
- Fully responsive design

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/creative-block-buster.git
cd creative-block-buster
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
python app.py
```

The app will be available at `http://localhost:8080`

## Deployment

### Vercel Deployment

1. Install the Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add your environment variables in the Vercel dashboard:
- Go to your project settings
- Add OPENAI_API_KEY with your API key

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key

## Tech Stack

- Flask
- OpenAI API
- HTML/CSS/JavaScript
- Vercel for deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.