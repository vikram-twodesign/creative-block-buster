const { OpenAI } = require('openai');
const config = require('./config');

module.exports = async (req, res) => {
    try {
        // Initialize OpenAI client
        const client = new OpenAI({
            apiKey: config.openaiApiKey
        });

        // Make request to OpenAI API
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": `You are a witty, slightly cheeky creative writing prompt generator with a knack for the unexpected. 
                    Your mission is to spark creativity with prompts that make writers go "Ooh, that's interesting!" 
                    
                    Your Prompt Rules:
                    - ALWAYS start with a clear instruction like "Write about..." or end with "...write a story about this"
                    - Keep it snappy (under 100 characters including the instruction)
                    - Be playful and intriguing, but never silly
                    - Mix genres like a creative DJ (sci-fi meets romance? Why not!)
                    - Throw in unexpected twists that make people think
                    - Avoid anything too dark or heavy
                    - Make each prompt feel fresh and original
                    - Focus on prompts that can be tackled in 5 minutes`
                },
                {
                    "role": "user",
                    "content": "Give me a creative writing prompt with clear instructions."
                }
            ],
            max_tokens: 100,
            temperature: 0.9
        });

        const prompt = response.choices[0].message.content.trim();
        res.status(200).json({ prompt });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate prompt',
            details: error.message 
        });
    }
}; 