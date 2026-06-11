import { sanitizeUrl } from '../sanitize-url';

describe('sanitizeUrl', () => {
  it('allows safe schemes', () => {
    expect(sanitizeUrl('https://example.com/path?q=1')).toBe('https://example.com/path?q=1');
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    expect(sanitizeUrl('mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(sanitizeUrl('tel:+15555555555')).toBe('tel:+15555555555');
  });

  it('allows relative and fragment URLs', () => {
    expect(sanitizeUrl('/foo/bar')).toBe('/foo/bar');
    expect(sanitizeUrl('#section')).toBe('#section');
    expect(sanitizeUrl('?q=1')).toBe('?q=1');
    expect(sanitizeUrl('example.com/path')).toBe('example.com/path');
  });

  it('rejects javascript: and other dangerous schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('JavaScript:alert(1)')).toBeNull();
    expect(sanitizeUrl('  javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(sanitizeUrl('blob:https://example.com/uuid')).toBeNull();
  });

  it('rejects schemes hidden behind control characters that browsers strip', () => {
    expect(sanitizeUrl('java\nscript:alert(1)')).toBeNull();
    expect(sanitizeUrl('java\tscript:alert(1)')).toBeNull();
    expect(sanitizeUrl('java\x00script:alert(1)')).toBeNull();
  });

  it('returns null for empty or non-string values', () => {
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl('   ')).toBeNull();
    expect(sanitizeUrl(null)).toBeNull();
    expect(sanitizeUrl(undefined)).toBeNull();
  });
});
