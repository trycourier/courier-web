/**
 * URL schemes that are safe to use as a link target. Notably this excludes
 * `javascript:`, `data:`, `vbscript:`, and `blob:`, which can execute script
 * or smuggle active content when assigned to an anchor's `href`.
 */
const SAFE_URL_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Control characters (including tab, newline, carriage return). Browsers strip
 * these from URLs before parsing, so `java\nscript:...` resolves to
 * `javascript:...`. We strip them too before detecting the scheme, otherwise
 * an attacker could hide a dangerous scheme from the check below.
 */
const URL_CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/**
 * Returns the URL unchanged if it uses a safe scheme (or is a scheme-relative /
 * relative URL), otherwise returns `null`.
 *
 * Use this before assigning any externally-sourced value (brand config,
 * notification data, etc.) to an element's `href` so a value like
 * `javascript:alert(1)` cannot run when the link is clicked.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (typeof url !== 'string') return null;

  // Strip control characters (matching browser URL parsing) before inspecting
  // the scheme, then trim surrounding whitespace.
  const cleaned = url.replace(URL_CONTROL_CHARS, '').trim();
  if (!cleaned) return null;

  // Relative and protocol-relative URLs have no scheme of their own and resolve
  // against the current document's origin, so they are safe to allow.
  if (cleaned.startsWith('/') || cleaned.startsWith('#') || cleaned.startsWith('?')) {
    return cleaned;
  }

  // If there's no scheme delimiter, treat it as a relative URL.
  const schemeMatch = /^([a-z][a-z0-9+.-]*):/i.exec(cleaned);
  if (!schemeMatch) {
    return cleaned;
  }

  const scheme = schemeMatch[1].toLowerCase() + ':';
  return SAFE_URL_SCHEMES.includes(scheme) ? cleaned : null;
}
