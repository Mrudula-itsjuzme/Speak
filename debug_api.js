const https = require('https');

const apiKey = 'AIzaSyCiiKbVZSTt1cOuGeXoy63rO4WrpIV4nwA';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching models from:', url.replace(apiKey, 'HIDDEN_KEY'));

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else if (json.models) {
                console.log('Available Models:');
                json.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log('Unexpected response:', data);
            }
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.log('Raw response:', data);
        }
    });
}).on('error', (err) => {
    console.error('Network Error:', err);
});
