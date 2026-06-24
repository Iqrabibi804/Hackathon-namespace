const fs = require('fs');
try {
  const stats = fs.statSync('C:\\Users\\Iqra bibi\\.gemini\\antigravity-ide\\brain\\d13943f4-ef16-46b4-a26f-6db5ab8f6162\\.system_generated\\logs\\transcript.jsonl');
  console.log('File size in bytes:', stats.size);
} catch (e) {
  console.error('Error reading stats:', e.message);
}
