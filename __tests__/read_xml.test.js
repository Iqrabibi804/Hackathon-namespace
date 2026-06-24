const path = require('path');
const { readXml } = require('../read_xml');

const fixturesDir = path.join(__dirname, 'fixtures');

describe('readXml', () => {
  test('extracts text from w:t tags in a simple document', () => {
    const result = readXml(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).toContain('Hello World');
    expect(result).toContain('test document');
    expect(result).toContain('Third paragraph');
  });

  test('extracts text from a document with tables', () => {
    const result = readXml(path.join(fixturesDir, 'table_document.xml'));
    expect(result).toContain('Document with table');
    expect(result).toContain('Name');
    expect(result).toContain('Value');
    expect(result).toContain('Alpha');
    expect(result).toContain('100');
    expect(result).toContain('End of document');
  });

  test('handles special characters in XML', () => {
    const result = readXml(path.join(fixturesDir, 'special_chars.xml'));
    expect(result).toContain('Special chars');
    expect(result).toContain('After break');
    expect(result).toContain('After tab');
  });

  test('returns empty string for file with no w:t tags', () => {
    const emptyXml = path.join(fixturesDir, 'empty.xml');
    const fs = require('fs');
    fs.writeFileSync(emptyXml, '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body></w:body></w:document>');
    const result = readXml(emptyXml);
    expect(result).toBe('');
    fs.unlinkSync(emptyXml);
  });

  test('returns error message for non-existent file', () => {
    const result = readXml('/nonexistent/file.xml');
    expect(result).toContain('Error:');
  });

  test('normalizes multiple spaces to single space', () => {
    const result = readXml(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).not.toMatch(/  +/);
  });

  test('joins text from multiple w:t tags with spaces', () => {
    const result = readXml(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).toContain('This is a');
    expect(result).toContain('test document');
  });
});
