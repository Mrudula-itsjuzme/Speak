/**
 * Simple OpenRouter API Test
 * Tests the OpenRouter API directly without TypeScript compilation
 */

const OPENROUTER_API_KEY = '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';

async function testPromptGeneration() {
    console.log('🧪 Testing OpenRouter - Language Learning Prompt\n');

    const prompt = `
    Create a detailed system prompt for an AI language tutor with the following traits:
    - Target Language: Spanish
    - User's Native Language: English
    - Personality: Friendly and encouraging
    - Current Topic: Ordering food at a restaurant
    - User Level: Beginner

    The system prompt should be designed for an ElevenLabs Conversational Agent.
    It must instruct the AI to:
    1. Behave consistently as the specified personality.
    2. Speak primarily in Spanish, adapting complexity to Beginner level.
    3. Provide brief translations or explanations in English ONLY when necessary or asked.
    4. Correct mistakes gently and encouragingly.
    5. Keep responses concise (1-3 sentences) to maintain conversational flow.
    6. Engage the user with relevant questions about the topic.

    Also generate a welcoming "first message" to start the conversation.

    Output JSON format:
    {
      "systemPrompt": "The detailed instruction for the AI...",
      "firstMessage": "The opening greeting in the target language..."
    }
  `;

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
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ API Error:', error);
            return;
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        console.log('✅ API Response received!\n');
        console.log('Model used:', data.model);
        console.log('\nResponse:');
        console.log(content);

        // Try to parse JSON
        console.log('\n📝 Parsing JSON...');
        try {
            const cleanText = content.replace(/```json\n|\n```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            console.log('✅ Successfully parsed!');
            console.log('\nSystem Prompt (first 150 chars):');
            console.log(parsed.systemPrompt.substring(0, 150) + '...');
            console.log('\nFirst Message:');
            console.log(parsed.firstMessage);
        } catch (e) {
            console.log('⚠️  Could not parse as JSON');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testTranslation() {
    console.log('\n\n🧪 Testing OpenRouter - UI Translation\n');

    const uiKeys = {
        'practice': 'Conversation Practice',
        'topic': 'Topic',
        'online': 'AI ONLINE',
        'roadmap': 'Your Roadmap'
    };

    const prompt = `
    Translate the following UI strings to Spanish.
    Return ONLY a valid JSON object where the keys are the same as the input keys, and the values are the translations.
    Do not include any markdown formatting or explanations.

    Input JSON:
    ${JSON.stringify(uiKeys, null, 2)}
  `;

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
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ API Error:', error);
            return;
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        console.log('✅ API Response received!\n');

        // Try to parse JSON
        try {
            const cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const translations = JSON.parse(cleanText);
            console.log('✅ Successfully parsed!');
            console.log('\nTranslations:');
            console.log(JSON.stringify(translations, null, 2));
        } catch (e) {
            console.log('⚠️  Could not parse as JSON');
            console.log('Raw response:', content);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runAllTests() {
    await testPromptGeneration();
    await testTranslation();
    console.log('\n\n🎉 All tests completed!');
}

runAllTests();
