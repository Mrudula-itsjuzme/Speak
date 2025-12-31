# 🔍 Voice Conversation Troubleshooting Guide

## Understanding the Architecture

Your Language Tutor Bot uses **two different APIs**:

### 1. OpenRouter (✅ Working)
- **Purpose:** Generates the initial system prompt and first message
- **When:** When you first load the `/learn` page
- **Status:** ✅ Working perfectly with GPT-4o-mini

### 2. ElevenLabs Conversational AI (❓ Issue Here)
- **Purpose:** Handles the actual voice conversation
- **When:** When you click "Join Call" and start speaking
- **Status:** ❓ This is where the problem is

## The Problem

When you speak, the audio goes to **ElevenLabs**, not OpenRouter. The ElevenLabs agent needs to be configured with the system prompt that OpenRouter generated.

## Common Issues & Solutions

### Issue 1: ElevenLabs Agent Not Configured

**Symptoms:**
- You can connect (green "Connected" button)
- You can speak, but get no response
- No errors in console

**Solution:**
The ElevenLabs agent needs to have the system prompt configured. This happens in two ways:

1. **Static Configuration** (in ElevenLabs dashboard)
   - Go to: https://elevenlabs.io/app/conversational-ai
   - Find your agent
   - Update the system prompt with language learning instructions

2. **Dynamic Configuration** (what your app tries to do)
   - The app tries to send the prompt when connecting
   - This might not be working

### Issue 2: Microphone Permissions

**Symptoms:**
- Can't connect at all
- Error about microphone access

**Solution:**
```
1. Check browser permissions (click lock icon in address bar)
2. Allow microphone access
3. Refresh the page
```

### Issue 3: ElevenLabs Agent ID Mismatch

**Symptoms:**
- Connection fails
- Error in console about agent not found

**Solution:**
Check that your `.env.local` has the correct agent ID:
```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_actual_agent_id
```

## Debugging Steps

### Step 1: Check Browser Console

1. Open your app: `http://localhost:3000/learn`
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Click "Join Call"
5. Try speaking

**Look for:**
- ✅ "Connected to ElevenLabs" - Good!
- ❌ Any red errors - Copy and share these
- 📝 "Message:" logs - Should appear when AI responds

### Step 2: Check Network Tab

1. In Developer Tools, go to "Network" tab
2. Filter by "WS" (WebSocket)
3. Click "Join Call"
4. You should see a WebSocket connection to ElevenLabs

**Look for:**
- ✅ Green status (101 Switching Protocols) - Good!
- ❌ Red status - Connection failed
- 📝 Click on the WebSocket to see messages

### Step 3: Test Microphone

1. Go to: https://www.onlinemictest.com/
2. Allow microphone access
3. Speak - you should see the bars move
4. If this doesn't work, your microphone isn't working

### Step 4: Check ElevenLabs Agent

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Find your agent (the ID should match your `.env.local`)
3. Click "Test" to test the agent directly
4. If this doesn't work, the agent itself has issues

## Quick Fixes

### Fix 1: Update ElevenLabs Agent Prompt

The agent might not have the right instructions. Update it manually:

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click on your agent
3. Update the "System Prompt" with:

```
You are a friendly and encouraging language tutor teaching [LANGUAGE].
The user is a beginner learning [LANGUAGE] and their native language is English.

Your role:
1. Speak primarily in [LANGUAGE], keeping it simple for beginners
2. Provide brief English translations when the user seems confused
3. Correct mistakes gently and encouragingly
4. Keep responses concise (1-3 sentences) for natural conversation
5. Ask engaging questions to practice the language
6. Be patient and supportive

Current topic: Basic greetings and introductions
```

Replace `[LANGUAGE]` with the language you're learning.

### Fix 2: Check if Agent is Active

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Make sure your agent is "Published" or "Active"
3. If it's in "Draft" mode, it won't work

### Fix 3: Verify API Keys

Run this to check your configuration:
```bash
node verify_env.js
```

Should show:
- ✅ OPENROUTER_API_KEY set
- ✅ NEXT_PUBLIC_ELEVENLABS_AGENT_ID set

## What to Check Next

Please check the following and let me know what you find:

1. **Browser Console Errors:**
   - Open F12 → Console
   - Click "Join Call" and try speaking
   - Copy any errors you see

2. **Network WebSocket:**
   - Open F12 → Network → WS filter
   - Click "Join Call"
   - Is there a WebSocket connection?
   - What's its status?

3. **ElevenLabs Dashboard:**
   - Go to https://elevenlabs.io/app/conversational-ai
   - Is your agent active?
   - Does it have a system prompt configured?

4. **Microphone Test:**
   - Go to https://www.onlinemictest.com/
   - Does your microphone work?

## Expected Behavior

When working correctly:

1. Click "Join Call" → Button turns green "Connected"
2. Speak into microphone → You see your message appear
3. AI responds → You see AI message appear
4. You hear the AI speaking back to you

## Still Not Working?

Share with me:
1. Any console errors (F12 → Console)
2. WebSocket status (F12 → Network → WS)
3. Whether the ElevenLabs agent test works on their website

---

**Note:** OpenRouter is working fine - it's only used for generating the initial prompt. The voice conversation issue is with ElevenLabs integration.
