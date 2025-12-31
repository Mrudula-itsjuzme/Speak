# OpenRouter Migration Guide

## What Changed?

Your Language Tutor Bot now uses **OpenRouter** instead of Google Gemini API. This gives you:

✅ **More flexibility** - Access to multiple AI models (Gemini, Claude, GPT-4, Llama, etc.)  
✅ **Better reliability** - Automatic fallback to other models if one fails  
✅ **Free tier available** - Many models have free tiers  
✅ **Better pricing** - Pay-as-you-go with competitive rates

## Setup Instructions

### 1. Update your `.env.local` file

Your `.env.local` should now contain:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=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
NEXT_PUBLIC_OPENROUTER_API_KEY=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

# Optional: Site URL for OpenRouter analytics
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Remove old Google API keys (optional)

You can remove these lines from `.env.local` if they exist:
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_GOOGLE_API_KEY`

## Available Models

The app will automatically try these models in order:

1. `google/gemini-2.0-flash-exp:free` (Free, fast)
2. `google/gemini-flash-1.5` (Paid, reliable)
3. `anthropic/claude-3.5-sonnet` (Paid, high quality)
4. `openai/gpt-4o-mini` (Paid, balanced)
5. `meta-llama/llama-3.1-8b-instruct:free` (Free, fallback)

## Testing

Run the test script to verify your API key works:

```bash
node test_openrouter.js
```

You should see:
```
✅ API Response: Hello! The API is working.
📊 Model used: google/gemini-2.0-flash-exp:free
💰 Usage: { prompt_tokens: X, completion_tokens: Y, total_tokens: Z }
```

## What Was Modified?

### New Files:
- `src/lib/openrouter/client.ts` - New OpenRouter client

### Updated Files:
- `src/app/api/prompt/route.ts` - Uses OpenRouter
- `src/app/api/summary/route.ts` - Uses OpenRouter
- `src/app/api/translate-ui/route.ts` - Uses OpenRouter

### Old Files (can be deleted):
- `src/lib/gemini/client.ts` - No longer used

## Getting Your Own API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Add it to your `.env.local` file

## Troubleshooting

### "OPENROUTER_API_KEY is not set"
- Make sure your `.env.local` file exists in the `speak` directory
- Restart your Next.js dev server after updating `.env.local`

### "All models failed"
- Check your API key is valid
- Check your OpenRouter account has credits (free tier should work)
- Check the console for specific error messages

### Models returning errors
- Some models require payment - the free models are marked with `:free`
- Check [OpenRouter Models](https://openrouter.ai/models) for availability

## Need Help?

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Discord](https://discord.gg/openrouter)
