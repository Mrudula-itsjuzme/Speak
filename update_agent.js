/**
 * Update ElevenLabs Agent ID
 * This script updates your .env.local with the new agent ID
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const newAgentId = 'agent_7301kdns729jekx9yb13049rk519';

console.log('🔧 Updating ElevenLabs Agent ID...\n');

// Read existing .env.local
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the old agent ID with the new one
const oldAgentIdPattern = /NEXT_PUBLIC_ELEVENLABS_AGENT_ID=.+/g;

if (envContent.match(oldAgentIdPattern)) {
    envContent = envContent.replace(
        oldAgentIdPattern,
        `NEXT_PUBLIC_ELEVENLABS_AGENT_ID=${newAgentId}`
    );
    console.log('✅ Updated existing NEXT_PUBLIC_ELEVENLABS_AGENT_ID');
} else {
    // Add it if it doesn't exist
    envContent += `\n# ElevenLabs Conversational AI\nNEXT_PUBLIC_ELEVENLABS_AGENT_ID=${newAgentId}\n`;
    console.log('✅ Added NEXT_PUBLIC_ELEVENLABS_AGENT_ID');
}

// Write back to file
fs.writeFileSync(envPath, envContent);

console.log('\nNew Agent ID:', newAgentId);
console.log('\n⚠️  IMPORTANT: You must restart your dev server for changes to take effect!');
console.log('\nNext steps:');
console.log('   1. Stop the dev server (Ctrl+C)');
console.log('   2. Run: npm run dev');
console.log('   3. Test at: http://localhost:3000/diagnostic');
console.log('   4. Or test the main app: http://localhost:3000/learn\n');
