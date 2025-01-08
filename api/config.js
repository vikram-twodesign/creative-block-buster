const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY
}; 