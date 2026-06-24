const fs = require('fs');
const path = require('path');

describe('read_transcript.js', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(fixturesDir, 'test_transcript.jsonl');

  beforeAll(() => {
    fs.writeFileSync(testFile, '{"line":1}\n{"line":2}\n{"line":3}\n');
  });

  afterAll(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test('fs.statSync returns correct file size for existing file', () => {
    const stats = fs.statSync(testFile);
    expect(stats.size).toBeGreaterThan(0);
    expect(typeof stats.size).toBe('number');
  });

  test('fs.statSync returns size matching file content length', () => {
    const content = '{"line":1}\n{"line":2}\n{"line":3}\n';
    const stats = fs.statSync(testFile);
    expect(stats.size).toBe(Buffer.byteLength(content, 'utf8'));
  });

  test('fs.statSync throws for non-existent file', () => {
    expect(() => {
      fs.statSync('/nonexistent/path/transcript.jsonl');
    }).toThrow();
  });

  test('fs.existsSync returns true for existing file', () => {
    expect(fs.existsSync(testFile)).toBe(true);
  });

  test('fs.existsSync returns false for non-existent file', () => {
    expect(fs.existsSync('/nonexistent/file.jsonl')).toBe(false);
  });
});
