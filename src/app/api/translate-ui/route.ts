import { generateContentSafe, extractJSON } from '@/lib/openrouter/client';
import { NextResponse } from 'next/server';


const uiKeys = {
  'practice': 'Conversation Practice',
  'topic': 'Topic',
  'online': 'AI ONLINE',
  'roadmap': 'Your Roadmap',
  'complete': 'Complete',
  'completed': 'COMPLETED',
  'in_progress': 'IN PROGRESS',
  'locked': 'LOCKED',
  'listen': 'Listen',
  'translate': 'Translate',
  'connected': 'Connected',
  'join': 'Join Call',
  'leave': 'Leave',
  'placeholder': 'Talk to MisSpoke !!'
};

export async function POST(request: Request) {
  try {
    const { targetLanguage } = await request.json();

    if (!targetLanguage || targetLanguage === 'English') {
      return NextResponse.json(uiKeys);
    }

    const prompt = `
      Translate the following UI strings to ${targetLanguage}.
      Return ONLY a valid JSON object where the keys are the same as the input keys, and the values are the translations.
      Do not include any markdown formatting or explanations.

      Input JSON:
      ${JSON.stringify(uiKeys, null, 2)}
    `;

    const text = await generateContentSafe(prompt);

    if (!text) throw new Error('Failed to translate');

    // Clean up markdown code blocks if present
    const cleanText = extractJSON(text);

    const translations = JSON.parse(cleanText);

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to English
    return NextResponse.json(uiKeys);
  }
}
