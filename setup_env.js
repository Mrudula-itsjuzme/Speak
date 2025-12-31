/**
 * Setup Environment Variables
 * This script helps add the OpenRouter API key to .env.local
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const apiKey = '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';

console.log('🔧 Setting up .env.local file...\n');

// Read existing .env.local if it exists
let existingContent = '';
if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Found existing .env.local file');
}

// Check if OpenRouter keys already exist
const hasOpenRouterKey = existingContent.includes('OPENROUTER_API_KEY');

if (hasOpenRouterKey) {
    console.log('✅ OPENROUTER_API_KEY already exists in .env.local');
    console.log('\nCurrent .env.local content:');
    console.log('─'.repeat(50));
    console.log(existingContent);
    console.log('─'.repeat(50));
} else {
    console.log('➕ Adding OPENROUTER_API_KEY to .env.local...');

    // Prepare new content
    let newContent = existingContent;

    // Remove old Google API keys if they exist (comment them out)
    if (newContent.includes('GOOGLE_API_KEY=')) {
        newContent = newContent.replace(/^GOOGLE_API_KEY=/gm, '# GOOGLE_API_KEY=');
        newContent = newContent.replace(/^NEXT_PUBLIC_GOOGLE_API_KEY=/gm, '# NEXT_PUBLIC_GOOGLE_API_KEY=');
    }

    // Add OpenRouter keys
    const openRouterConfig = `
# OpenRouter API Configuration (replaces Google Gemini)
OPENROUTER_API_KEY=${apiKey}
NEXT_PUBLIC_OPENROUTER_API_KEY=${apiKey}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;

    newContent = newContent.trim() + '\n' + openRouterConfig;

    // Write to file
    fs.writeFileSync(envPath, newContent);

    console.log('✅ Successfully updated .env.local!');
    console.log('\nNew .env.local content:');
    console.log('─'.repeat(50));
    console.log(newContent);
    console.log('─'.repeat(50));
}

console.log('\n⚠️  IMPORTANT: You must restart your Next.js dev server for changes to take effect!');
console.log('\n📝 Next steps:');
console.log('   1. Stop the current dev server (Ctrl+C)');
console.log('   2. Run: npm run dev');
console.log('   3. Test your app at http://localhost:3000\n');
