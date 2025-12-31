/**
 * Verify Environment Setup
 * Checks if OpenRouter API key is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Environment Setup\n');

// Check .env.local file
const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('   Run: node setup_env.js');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Check for OpenRouter keys
const hasOpenRouterKey = envContent.includes('OPENROUTER_API_KEY=sk-or-v1-');
const hasPublicKey = envContent.includes('NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-');

console.log('Environment File Checks:');
console.log('─'.repeat(50));
console.log(`✅ .env.local exists: YES`);
console.log(`${hasOpenRouterKey ? '✅' : '❌'} OPENROUTER_API_KEY set: ${hasOpenRouterKey ? 'YES' : 'NO'}`);
console.log(`${hasPublicKey ? '✅' : '❌'} NEXT_PUBLIC_OPENROUTER_API_KEY set: ${hasPublicKey ? 'YES' : 'NO'}`);
console.log('─'.repeat(50));

if (hasOpenRouterKey && hasPublicKey) {
    console.log('\n✅ Environment is properly configured!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your dev server is stopped');
    console.log('   2. Start it with: npm run dev');
    console.log('   3. The app should now use OpenRouter API\n');
} else {
    console.log('\n❌ Environment is NOT properly configured!');
    console.log('   Run: node setup_env.js\n');
}

// Show current .env.local content (masked)
console.log('\nCurrent .env.local (API keys masked):');
console.log('─'.repeat(50));
const maskedContent = envContent.replace(/(sk-or-v1-)[a-f0-9]+/g, '$1***MASKED***');
console.log(maskedContent);
console.log('─'.repeat(50));
