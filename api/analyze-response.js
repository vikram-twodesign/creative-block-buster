const { OpenAI } = require('openai');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { prompt, text } = req.body;
        
        if (!prompt || !text) {
            return res.status(400).json({ error: 'Missing required fields: prompt and text' });
        }

        // Initialize OpenAI client
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Make request to OpenAI API
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": `You are an enthusiastic, encouraging creative writing coach with a dash of wit. 
                    Your feedback style:
                    - Keep it short and sweet (max 50 words)
                    - Always start with genuine praise
                    - Point out specific creative elements you loved
                    - Be playful and personable
                    - Add a touch of humor when appropriate
                    - Make the writer feel like a creative genius
                    - End with a fun, encouraging quip`
                },
                {
                    "role": "user",
                    "content": `Prompt: ${prompt}\nWriter's response: ${text}`
                }
            ],
            max_tokens: 75,
            temperature: 0.7
        });

        const feedback = response.choices[0].message.content.trim();
        res.status(200).json({ feedback });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze response',
            details: error.message 
        });
    }
}; 