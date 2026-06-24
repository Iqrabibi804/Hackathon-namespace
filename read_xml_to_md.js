const fs = require('fs');
const path = require('path');

function docxXmlToMarkdown(xmlPath) {
  try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    
    // Simple stateful XML parsing
    // We care about <w:p> for paragraphs, <w:t> for text, <w:tr> and <w:tc> for tables
    let output = '';
    let inParagraph = false;
    let inTable = false;
    let inRow = false;
    
    // We can parse tag by tag using regex
    const tagRegex = /<[^>]+>|[^<]+/g;
    let match;
    
    while ((match = tagRegex.exec(xmlContent)) !== null) {
      const token = match[0];
      if (token.startsWith('<')) {
        const tagName = token.match(/<w:([a-zA-Z0-9]+)/);
        if (tagName) {
          const name = tagName[1];
          if (name === 'p') {
            output += '\n\n';
          } else if (name === 'br' || name === 'cr') {
            output += '\n';
          } else if (name === 'tab') {
            output += '\t';
          } else if (name === 'tr') {
            output += '\n| ';
          } else if (name === 'tc') {
            output += ' | ';
          }
        }
      } else {
        // Text node
        // Decode HTML entities
        const text = token
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
        output += text;
      }
    }
    
    // Clean up multiple newlines
    return output.replace(/\n{3,}/g, '\n\n').trim();
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

const inputXml = process.argv[2];
const outputFile = process.argv[3];

if (inputXml && outputFile) {
  const md = docxXmlToMarkdown(inputXml);
  fs.writeFileSync(outputFile, md, 'utf8');
  console.log(`Successfully converted ${inputXml} to ${outputFile}`);
} else {
  console.log('Usage: node read_xml_to_md.js <input_xml> <output_md>');
}
