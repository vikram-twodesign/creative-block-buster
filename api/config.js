const path = require('path');

// Only use dotenv in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

// In production (Vercel), we'll use the environment variables directly
module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY || ''
}; 