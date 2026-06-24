const fs = require('fs');
const path = require('path');

function readXml(xmlPath) {
  try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    // Extract all content inside <w:t> tags
    const matches = xmlContent.match(/<w:t[^>]*>([^<]*)/g);
    if (!matches) return '';
    
    return matches
      .map(match => {
        const text = match.replace(/<w:t[^>]*>/, '');
        return text;
      })
      .join(' ')
      .replace(/\s+/g, ' '); // normalize spaces
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

const target = process.argv[2];
if (target) {
  console.log(readXml(target));
} else if (require.main === module) {
  console.log('Provide path to document.xml');
}

module.exports = { readXml };
