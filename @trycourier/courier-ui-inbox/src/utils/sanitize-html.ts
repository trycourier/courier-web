/**
 * Escapes HTML special characters for safe text content.
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
 * Escapes a string for safe use in an HTML attribute (e.g. href).
 */
function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/\n/g, ' ');
}

/**
 * Returns true if the string looks like it contains HTML (e.g. from markdown link conversion).
 */
export function looksLikeHtml(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Sanitizes HTML for safe display in the inbox. Only allows <a> tags with http(s) href.
 * All other tags are stripped; their content is preserved as escaped text.
 * Use for message body/preview that may contain inline links.
 */
export function sanitizeHtmlForInbox(html: string): string {
  if (typeof html !== 'string') return '';
  if (!html.trim()) return '';

  try {
    const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
    if (!parser) return escapeHtml(html);

    const doc = parser.parseFromString(html, 'text/html');

    function walk(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return escapeHtml(node.textContent ?? '');
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const el = node as Element;
      const tagName = el.tagName.toUpperCase();

      if (tagName === 'A') {
        const href = el.getAttribute('href') ?? '';
        if (/^https?:\/\//i.test(href)) {
          const safeHref = escapeAttr(href);
          const inner = Array.from(el.childNodes).map(walk).join('');
          return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
        }
      }

      return Array.from(el.childNodes).map(walk).join('');
    }

    return Array.from(doc.body.childNodes).map(walk).join('');
  } catch {
    return escapeHtml(html);
  }
}
