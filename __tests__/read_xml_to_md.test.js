const path = require('path');
const fs = require('fs');
const { docxXmlToMarkdown } = require('../read_xml_to_md');

const fixturesDir = path.join(__dirname, 'fixtures');

describe('docxXmlToMarkdown', () => {
  test('converts simple paragraphs to markdown with double newlines', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).toContain('Hello World');
    expect(result).toContain('This is a');
    expect(result).toContain('test document');
    expect(result).toContain('Third paragraph');
  });

  test('separates paragraphs with newlines', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'sample_document.xml'));
    const lines = result.split('\n').filter(l => l.trim());
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  test('converts tables with pipe-separated columns', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'table_document.xml'));
    expect(result).toContain('|');
    expect(result).toContain('Name');
    expect(result).toContain('Value');
    expect(result).toContain('Alpha');
    expect(result).toContain('100');
  });

  test('handles special HTML entities', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'special_chars.xml'));
    expect(result).toContain('&');
    expect(result).toContain('<');
    expect(result).toContain('>');
  });

  test('handles line breaks (w:br) as newlines', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'special_chars.xml'));
    expect(result).toContain('After break');
  });

  test('handles tabs (w:tab) as tab characters', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'special_chars.xml'));
    expect(result).toContain('\t');
  });

  test('does not produce more than 2 consecutive newlines', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).not.toMatch(/\n{3,}/);
  });

  test('returns error message for non-existent file', () => {
    const result = docxXmlToMarkdown('/nonexistent/path.xml');
    expect(result).toContain('Error:');
  });

  test('trims output (no leading/trailing whitespace)', () => {
    const result = docxXmlToMarkdown(path.join(fixturesDir, 'sample_document.xml'));
    expect(result).toBe(result.trim());
  });
});
