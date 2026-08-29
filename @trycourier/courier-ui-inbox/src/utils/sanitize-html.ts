/**
 * Escapes HTML special characters for safe text content.
 */
export function escapeHtml(text: string): string {
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
export function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/\n/g, ' ');
}

/**
 * Returns true if the string looks like it contains HTML (e.g. from markdown link conversion).
 */
export function looksLikeHtml(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/** Class and cursor for subtitle/title links; full styling from theme via list item CSS (inbox.list.item.subtitleLink). */
export const LINK_ATTRS = ' class="courier-inbox-subtitle-link" style="cursor: pointer;"';

/**
 * Normalizes malformed preview HTML (markdown in href, broken target/rel) before parsing.
 */
function normalizePreviewHtml(html: string): string {
  let out = html;
  out = out.replace(
    /href\s*=\s*["']?\[[^\]]*\]\s*\(\s*(https?:\/\/[^\s)]+)\s*\)/gi,
    (_: string, url: string) => `href="${url}"`
  );
  out = out.replace(/target\s*=\s*["']?\+?blank["']?/gi, 'target="_blank"');
  out = out.replace(/rel\s*=\s*["']?noopener\s+no\s*referrer["']?/gi, 'rel="noopener noreferrer"');
  out = out.replace(/rel\s*=\s*["']?noopener\s*noreferrer["']?/gi, 'rel="noopener noreferrer"');
  out = out.replace(/rel\s*=\s*["']?noopener["']?/gi, 'rel="noopener noreferrer"');
  return out;
}

/**
 * Inline formatting the inbox renders. These carry no attributes, so they are emitted bare —
 * only <a> needs its href checked.
 */
const INLINE_TAGS = new Set(['STRONG', 'B', 'EM', 'I', 'S', 'DEL', 'BR', 'SPAN']);

/**
 * Sanitizes HTML for safe display in the inbox. Allows <a> tags with http(s) href plus the
 * inline formatting tags the preview markdown renderer produces.
 * Normalizes malformed preview HTML first (e.g. markdown in href, target="+blank").
 * All other tags are stripped; their content is preserved as escaped text.
 */
export function sanitizeHtmlForInbox(html: string): string {
  if (typeof html !== 'string') return '';
  if (!html.trim()) return '';

  const normalized = normalizePreviewHtml(html);

  try {
    const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
    if (!parser) return escapeHtml(html);

    const doc = parser.parseFromString(normalized, 'text/html');

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
          return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="courier-inbox-subtitle-link" style="cursor: pointer;">${inner}</a>`;
        }
      }

      if (INLINE_TAGS.has(tagName)) {
        if (tagName === 'BR') return '<br>';
        const inner = Array.from(el.childNodes).map(walk).join('');
        // The bullet marker is the one span the renderer emits; any other span is unwrapped.
        if (tagName === 'SPAN') {
          return el.getAttribute('class') === 'courier-inbox-md-bullet'
            ? `<span class="courier-inbox-md-bullet">${inner}</span>`
            : inner;
        }
        const tag = tagName.toLowerCase();
        return `<${tag}>${inner}</${tag}>`;
      }

      return Array.from(el.childNodes).map(walk).join('');
    }

    return Array.from(doc.body.childNodes).map(walk).join('');
  } catch {
    return escapeHtml(normalized);
  }
}
