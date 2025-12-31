const fs = require('fs');
const path = require('path');

const content = `ELEVENLABS_API_KEY=sk_e4c2e3ec1a803430fdb60be4c3674c773b94e9f96b14d5a6
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_4901kd0w9azbfxt99wzjf6jfpdef
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyCiiKbVZSTt1cOuGeXoy63rO4WrpIV4nwA
GOOGLE_API_KEY=AIzaSyCiiKbVZSTt1cOuGeXoy63rO4WrpIV4nwA
`;

fs.writeFileSync(path.join(__dirname, '.env.local'), content, { encoding: 'utf8' });
console.log('.env.local has been written with UTF-8 encoding.');
