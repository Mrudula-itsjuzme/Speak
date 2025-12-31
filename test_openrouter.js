// Test OpenRouter API
const OPENROUTER_API_KEY = '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';

async function testOpenRouter() {
    console.log('Testing OpenRouter API...\n');

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Language Tutor Bot'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Say "Hello! The API is working." in a friendly way.'
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ API Error:', data);
            return false;
        }

        console.log('✅ API Response:', data.choices[0].message.content);
        console.log('\n📊 Model used:', data.model);
        console.log('💰 Usage:', data.usage);
        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

testOpenRouter();
