import { escapeGraphQLString, assertSafeGraphQLEnumValue } from '../graphql';

describe('escapeGraphQLString', () => {
  it('escapes double quotes so a value cannot break out of a string literal', () => {
    const malicious = 'x") { injected } #';
    const escaped = escapeGraphQLString(malicious);
    // No unescaped double quote remains (every " is preceded by a backslash).
    expect(escaped.replace(/\\"/g, '')).not.toContain('"');
    expect(escaped).toBe('x\\") { injected } #');
    // Embedded in a query, the closing quote is escaped, keeping the literal intact.
    const fragment = `messageId: "${escaped}"`;
    expect(fragment).toBe('messageId: "x\\") { injected } #"');
  });

  it('escapes backslashes', () => {
    expect(escapeGraphQLString('a\\b')).toBe('a\\\\b');
  });

  it('escapes control characters using GraphQL escape sequences', () => {
    expect(escapeGraphQLString('a\nb\tc\rd')).toBe('a\\nb\\tc\\rd');
    expect(escapeGraphQLString('\b\f')).toBe('\\b\\f');
    // Other control characters fall back to \uXXXX.
    expect(escapeGraphQLString('\x01')).toBe('\\u0001');
  });

  it('leaves safe values unchanged', () => {
    expect(escapeGraphQLString('abc-123_DEF')).toBe('abc-123_DEF');
  });
});

describe('assertSafeGraphQLEnumValue', () => {
  it('accepts valid GraphQL names', () => {
    expect(assertSafeGraphQLEnumValue('OPTED_IN')).toBe('OPTED_IN');
    expect(assertSafeGraphQLEnumValue('email')).toBe('email');
  });

  it('throws for values that could inject query structure', () => {
    expect(() => assertSafeGraphQLEnumValue('email] foo: bar #')).toThrow();
    expect(() => assertSafeGraphQLEnumValue('1abc')).toThrow();
    expect(() => assertSafeGraphQLEnumValue('"quoted"')).toThrow();
  });
});
