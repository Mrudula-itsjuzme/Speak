# 🔧 ElevenLabs Agent Setup Guide

## The Problem

Your ElevenLabs Conversational AI agent is broken/not configured properly. Let's fix it!

## Option 1: Create a New Agent (Recommended)

### Step 1: Go to ElevenLabs Dashboard

1. Visit: https://elevenlabs.io/app/conversational-ai
2. Log in to your account

### Step 2: Create New Agent

1. Click **"Create Agent"** or **"New Agent"**
2. Fill in the details:

**Agent Name:** Language Tutor Bot

**System Prompt:** (Copy this exactly)
```
You are a friendly and encouraging language tutor helping users learn new languages through conversation.

Your role:
- Speak primarily in the target language (the user will tell you which language)
- Keep responses very concise (1-3 sentences maximum)
- Correct mistakes gently and encouragingly
- Ask engaging questions to practice conversation
- Provide brief translations in English only when the user seems confused
- Be patient, supportive, and enthusiastic
- Adapt to the user's skill level

When the user first connects, greet them warmly and ask what language they want to practice.
```

**First Message:** (Optional)
```
Hello! I'm your language tutor. What language would you like to practice today?
```

**Voice Settings:**
- Choose a voice you like (try different ones!)
- Recommended: A clear, friendly voice
- Language: English (or the language you're teaching)

**Model:**
- Use the default (usually Turbo v2.5 or latest)

### Step 3: Configure Advanced Settings

**Response Length:**
- Set to "Short" or "Medium" (for conversational flow)

**Temperature:**
- Set to 0.7-0.8 (balanced creativity)

**Enable:**
- ✅ Voice Activity Detection (VAD)
- ✅ Interruptions (so user can interrupt)
- ✅ Background noise suppression

### Step 4: Publish the Agent

1. Click **"Publish"** or **"Save"**
2. Make sure status shows **"Published"** (not Draft)
3. **Copy the Agent ID** - you'll need this!

### Step 5: Test the Agent

1. On the ElevenLabs dashboard, click **"Test"** on your agent
2. Speak to it: "Hello, I want to learn Spanish"
3. **Does it respond?**
   - ✅ Yes → Great! Copy the Agent ID
   - ❌ No → Check the system prompt and voice settings

### Step 6: Update Your .env.local

1. Open `.env.local` in your project
2. Update or add this line:
```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_new_agent_id_here
```
3. Replace `your_new_agent_id_here` with the Agent ID you copied
4. **Save the file**
5. **Restart your dev server** (Ctrl+C, then `npm run dev`)

## Option 2: Fix Existing Agent

If you want to fix your existing agent instead:

### Step 1: Find Your Agent

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Find the agent with the ID from your `.env.local`
3. Click on it to edit

### Step 2: Update Configuration

Update these fields:

**System Prompt:**
```
You are a friendly and encouraging language tutor helping users learn new languages through conversation.

Your role:
- Speak primarily in the target language (the user will tell you which language)
- Keep responses very concise (1-3 sentences maximum)
- Correct mistakes gently and encouragingly
- Ask engaging questions to practice conversation
- Provide brief translations in English only when the user seems confused
- Be patient, supportive, and enthusiastic
- Adapt to the user's skill level

When the user first connects, greet them warmly and ask what language they want to practice today.
```

**Make sure:**
- ✅ Voice is selected
- ✅ Model is selected
- ✅ Status is "Published" (not Draft)

### Step 3: Test It

1. Click **"Test"** on the dashboard
2. Speak to it
3. Verify it responds

### Step 4: Restart Your App

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

## Verification Script

Run this to verify your setup:

```bash
node -e "const fs = require('fs'); const env = fs.readFileSync('.env.local', 'utf8'); const match = env.match(/NEXT_PUBLIC_ELEVENLABS_AGENT_ID=(.+)/); if (match) { console.log('✅ Agent ID found:', match[1].trim()); } else { console.log('❌ Agent ID not found in .env.local'); }"
```

## Testing Your App

After setting up the agent:

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Visit diagnostic page:**
   ```
   http://localhost:3000/diagnostic
   ```

3. **Click "Start Connection"**

4. **Speak:** "Hello, I want to learn Japanese"

5. **Expected result:**
   - ✅ You see "Connected to ElevenLabs" in logs
   - ✅ You see your message appear
   - ✅ You see AI response appear
   - ✅ You hear the AI speaking

## Common Issues

### Issue: "Agent not found"
**Solution:** Double-check the Agent ID in `.env.local` matches the one on ElevenLabs dashboard

### Issue: "Agent responds on dashboard but not in app"
**Solution:** 
1. Make sure agent is "Published"
2. Restart your dev server
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "No audio output"
**Solution:**
1. Check browser audio isn't muted
2. Check system volume
3. Try different voice in agent settings

### Issue: "Can't connect at all"
**Solution:**
1. Check microphone permissions in browser
2. Try different browser (Chrome works best)
3. Check ElevenLabs API quota/credits

## Alternative: Use a Different Voice AI

If ElevenLabs continues to have issues, you could switch to:

1. **OpenAI Realtime API** - Voice conversation with GPT-4
2. **Agora Conversational AI** - Like the reference repo
3. **Google Cloud Speech + TTS** - More control but more complex

Let me know if you want to explore these options!

## Quick Setup Command

Run this to check your current setup:

```bash
node verify_env.js
```

Should show:
```
✅ OPENROUTER_API_KEY set: YES
✅ NEXT_PUBLIC_ELEVENLABS_AGENT_ID set: YES
```

---

**Next Steps:**
1. Create/fix your ElevenLabs agent
2. Copy the Agent ID
3. Update `.env.local`
4. Restart dev server
5. Test at http://localhost:3000/diagnostic
