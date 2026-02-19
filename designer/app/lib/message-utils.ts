/**
 * Replaces {{variableName}} placeholders in a string with values from a record.
 * Keys are matched case-sensitively; missing keys are left as {{key}}.
 * Values are HTML-escaped for safe use in title/body text.
 */
export function substituteVariables(
  str: string,
  variables: Record<string, string>
): string {
  if (!str || Object.keys(variables).length === 0) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in variables ? escapeHtml(variables[key]) : `{{${key}}}`
  );
}

/**
 * Like substituteVariables but does not escape values. Use for URLs (e.g. action href).
 */
export function substituteVariablesRaw(
  str: string,
  variables: Record<string, string>
): string {
  if (!str || Object.keys(variables).length === 0) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in variables ? String(variables[key]) : `{{${key}}}`
  );
}

/**
 * Escapes HTML special characters to prevent XSS when interpolating into HTML.
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (c) => map[c] ?? c);
}

/**
 * Converts markdown-style links [text](url) in the body to HTML <a> tags.
 * URL is escaped for safe attributes; link text is escaped for safe content.
 */
export function markdownLinksToHtml(str: string): string {
  if (!str) return str;
  // Match [link text](url) - url can be anything except ) and newline
  return str.replace(
    /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, text: string, url: string) => {
      const safeUrl = url.replace(/[<>"']/g, (c) => ({
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }[c] ?? c));
      const safeText = escapeHtml(text || url);
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
    }
  );
}
