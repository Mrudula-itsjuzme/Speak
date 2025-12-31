import { GoogleGenerativeAI } from '@google/generative-ai';

const modelsToTry = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro-latest',
  'gemini-pro',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro'
];

export async function generateContentSafe(prompt: string): Promise<string | null> {
  // Try both API keys
  const keys = [
    process.env.GOOGLE_API_KEY,
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  ].filter(Boolean);

  for (const key of keys) {
    const genAI = new GoogleGenerativeAI(key!);

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.warn(`Failed with model ${modelName} using key ending in ...${key!.slice(-4)}:`, error);
        continue;
      }
    }
  }

  return null;
}

export const model = (function () {
  // Legacy export for existing code, tries to be safe but might fail
  const key = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-pro-latest' });
})();

export async function generateSessionSummary(transcript: string) {
  const prompt = `
    Analyze the following language learning session transcript.
    Identify:
    1. Key topics discussed
    2. Main grammatical mistakes made by the user
    3. New vocabulary used correctly
    4. The user's emotional state (confident, hesitant, frustrated, etc.)

    Transcript:
    ${transcript}

    Output JSON format:
    {
      "summary": "Brief 1-sentence summary",
      "mistakes": ["mistake 1", "mistake 2"],
      "vocabulary": ["word 1", "word 2"],
      "emotions": ["emotion 1", "emotion 2"]
    }
  `;

  const text = await generateContentSafe(prompt);

  if (!text) return null;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Gemini summary parsing failed:', error);
    return null;
  }
}
