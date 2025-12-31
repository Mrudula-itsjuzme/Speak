import { NextResponse } from 'next/server';
import { generateContentSafe } from '@/lib/openrouter/client';


export async function POST(request: Request) {
  let language, personality, topic, level;

  try {
    const body = await request.json();
    language = body.language;
    const nativeLanguage = body.nativeLanguage || 'English';
    personality = body.personality;
    topic = body.topic;
    level = body.level;
    const historyContext = body.historyContext || '';

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    const prompt = `
      Create a detailed system prompt for an AI language tutor with the following traits:
      - Target Language: ${language}
      - User's Native Language: ${nativeLanguage}
      - Personality: ${personality}
      - Current Topic: ${topic}
      - User Level: ${level}

      The system prompt should be designed for an ElevenLabs Conversational Agent.
      It must instruct the AI to:
      1. Behave consistently as the specified personality.
      2. Speak primarily in ${language}, adapting complexity to ${level}.
      3. Provide brief translations or explanations in ${nativeLanguage} ONLY when necessary or asked.
      4. Correct mistakes gently and encouragingly.
      5. Keep responses concise (1-3 sentences) to maintain conversational flow.
      6. Engage the user with relevant questions about the topic.

      ${historyContext ? `---
      PREVIOUS CONTEXT (Use this to provide continuity):
      ${historyContext}
      ---` : ''}

      Also generate a welcoming "first message" to start the conversation.

      Output JSON format:
      {
        "systemPrompt": "The detailed instruction for the AI...",
        "firstMessage": "The opening greeting in the target language..."
      }
    `;

    const text = await generateContentSafe(prompt);

    if (!text) {
      throw new Error('Failed to generate prompt from any model');
    }

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json\n|\n```/g, '').trim();

    try {
      const data = JSON.parse(cleanText);
      return NextResponse.json(data);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json({
        systemPrompt: `You are a ${personality} ${language} tutor. Teach ${topic}.`,
        firstMessage: `Hello! Let's learn ${language}.`
      });
    }

  } catch (error) {
    console.error('Error generating prompt:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Fallback to static prompt on error
    return NextResponse.json({
      systemPrompt: `You are a ${personality || 'friendly'} ${language || 'language'} tutor. Teach ${topic || 'conversation'}.`,
      firstMessage: `Hello! Let's learn ${language || 'a new language'}.`
    });
  }
}
