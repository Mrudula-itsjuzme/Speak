const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
let apiKey = '';
try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    const match = envContent.match(/GOOGLE_API_KEY=([^\r\n]+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Could not read .env.local', e);
}

if (!apiKey) {
    console.error('API Key not found in .env.local');
    process.exit(1);
}

async function listModels() {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Using Key:', apiKey.substring(0, 10) + '...');

    const modelsToTry = [
        'gemini-2.0-flash-exp', // Newest
        'gemini-1.5-flash',     // Standard Flash
        'gemini-1.5-pro',       // Standard Pro
        'gemini-1.0-pro',       // Old Pro
        'gemini-pro'            // Alias
    ];

    for (const modelName of modelsToTry) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            // Verify by generating 1 token
            const m = genAI.getGenerativeModel({ model: modelName });
            const result = await m.generateContent('Hi');
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} works! Response: ${response.text().substring(0, 20)}...`);
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message.split('\n')[0]}`);
        }
    }
}

listModels();
