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

/** Class and cursor for subtitle/title links; full styling from theme via list item CSS (inbox.list.item.subtitleLink). */
const LINK_ATTRS = ' class="courier-inbox-subtitle-link" style="cursor: pointer;"';

/**
 * Converts plain text into HTML by making links clickable:
 * - Markdown links [link text](https://url) become <a> tags
 * - Bare http(s) URLs become <a> tags
 * Non-link text is escaped. Use with sanitizeHtmlForInbox for safe display.
 */
export function linkifyPlainText(text: string): string {
  if (typeof text !== 'string' || !text) return '';

  // Match either markdown link or bare URL (markdown first so we don't double-wrap)
  const combinedRegex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"']+)/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  combinedRegex.lastIndex = 0;
  while ((match = combinedRegex.exec(text)) !== null) {
    parts.push(escapeHtml(text.slice(lastIndex, match.index)));
    const mdText = match[1];
    const mdUrl = match[2];
    const bareUrl = match[3];
    if (mdUrl !== undefined) {
      // Markdown link [text](url)
      const safeUrl = escapeAttr(mdUrl);
      const safeText = escapeHtml(mdText ?? mdUrl);
      parts.push(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer"${LINK_ATTRS}>${safeText}</a>`);
    } else if (bareUrl !== undefined) {
      // Bare URL
      const safeUrl = escapeAttr(bareUrl);
      parts.push(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer"${LINK_ATTRS}>${escapeHtml(bareUrl)}</a>`);
    }
    lastIndex = match.index + match[0].length;
  }
  parts.push(escapeHtml(text.slice(lastIndex)));
  return parts.join('');
}

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
 * Sanitizes HTML for safe display in the inbox. Only allows <a> tags with http(s) href.
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

      return Array.from(el.childNodes).map(walk).join('');
    }

    return Array.from(doc.body.childNodes).map(walk).join('');
  } catch {
    return escapeHtml(normalized);
  }
}
