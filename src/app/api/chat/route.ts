import { NextResponse } from 'next/server';
import { generateContentSafe } from '@/lib/openrouter/client';

export async function POST(request: Request) {
    try {
        const { messages, language, personality, topic, level } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const systemPrompt = `
      You are a friendly and encouraging language tutor.
      - Target Language: ${language}
      - Personality: ${personality}
      - Current Topic: ${topic}
      - User Level: ${level}

      Instructions:
      1. Behave consistently as the specified personality.
      2. Speak primarily in ${language}, adapting complexity to ${level}.
      3. Provide brief translations or explanations only when necessary.
      4. Correct mistakes gently and encouragingly.
      5. Keep responses concise (1-3 sentences) to maintain conversational flow.
    `;

        // Convert messages to prompt format for generateContentSafe
        // In a real app, we might want to send the whole history
        const lastUserMessage = messages[messages.length - 1].content;
        const fullPrompt = `${systemPrompt}\n\nUser: ${lastUserMessage}\nAssistant:`;

        const text = await generateContentSafe(fullPrompt);

        if (!text) {
            throw new Error('Failed to generate response');
        }

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
