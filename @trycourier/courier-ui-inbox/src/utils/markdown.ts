import { escapeHtml, escapeAttr, LINK_ATTRS } from "./sanitize-html";

/**
 * Renders the markdown a message's title and preview can carry.
 *
 * The inbox channel renders its preview through the backend's markdown serializer, so a preview
 * arrives as markdown source rather than as text or HTML. Left alone it shows its own syntax to
 * the reader — `**Order shipped**` instead of a bold phrase. Titles are passed through verbatim
 * rather than serialized, so whatever markdown an author typed arrives intact and is rendered
 * the same way here.
 *
 * The vocabulary is deliberately the one that survives that serializer, confirmed against live
 * output: bold, italic, strikethrough, links, block quotes and list markers. Code spans,
 * headings, images and horizontal rules are stripped upstream and never arrive, so there is
 * nothing to render for them.
 */

/**
 * Emphasis delimiters must hug their content — `_x_` is emphasis, `5 _ 3 _ 2` is arithmetic.
 * Matching that here is what keeps prose containing a stray asterisk or an underscored_name
 * from being mangled.
 */
const INLINE = new RegExp([
  '\\[([^\\]]*)\\]\\((https?:\\/\\/[^\\s)]+)\\)',      // 1,2  [text](url)
  '(https?:\\/\\/[^\\s<>"\']+)',                        // 3    bare url
  '\\*\\*(\\S|\\S[\\s\\S]*?\\S)\\*\\*',                 // 4    **bold**
  '__(\\S|\\S[\\s\\S]*?\\S)__',                         // 5    __bold__
  '~~(\\S|\\S[\\s\\S]*?\\S)~~',                         // 6    ~~strike~~
  '\\*(\\S|\\S[^*\\n]*?\\S)\\*',                        // 7    *italic*
  '_(\\S|\\S[^_\\n]*?\\S)_'                             // 8    _italic_
].join('|'), 'g');

/** `_` inside a word is part of the word (`user_id`), not an emphasis delimiter. */
function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[A-Za-z0-9]/.test(char);
}

function renderInline(text: string): string {
  const out: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    const [whole, linkText, linkUrl, bareUrl, boldStar, boldUnder, strike, italStar, italUnder] = match;

    // An underscore run that sits inside a word is not emphasis. Skip it rather than consuming
    // it, so a later real delimiter in the same string can still match.
    if ((boldUnder !== undefined || italUnder !== undefined)
      && (isWordChar(text[match.index - 1]) || isWordChar(text[match.index + whole.length]))) {
      INLINE.lastIndex = match.index + 1;
      continue;
    }

    out.push(escapeHtml(text.slice(lastIndex, match.index)));

    if (linkUrl !== undefined) {
      out.push(`<a href="${escapeAttr(linkUrl)}" target="_blank" rel="noopener noreferrer"${LINK_ATTRS}>${renderInline(linkText ?? linkUrl)}</a>`);
    } else if (bareUrl !== undefined) {
      out.push(`<a href="${escapeAttr(bareUrl)}" target="_blank" rel="noopener noreferrer"${LINK_ATTRS}>${escapeHtml(bareUrl)}</a>`);
    } else if (boldStar !== undefined || boldUnder !== undefined) {
      out.push(`<strong>${renderInline(boldStar ?? boldUnder)}</strong>`);
    } else if (strike !== undefined) {
      out.push(`<s>${renderInline(strike)}</s>`);
    } else if (italStar !== undefined || italUnder !== undefined) {
      out.push(`<em>${renderInline(italStar ?? italUnder)}</em>`);
    }

    lastIndex = match.index + whole.length;
    INLINE.lastIndex = lastIndex;
  }

  out.push(escapeHtml(text.slice(lastIndex)));
  return out.join('');
}

/** A line's leading marker, if it carries one. */
const BLOCK_MARKER = /^\s*(?:([+\-*])\s+|(>)\s?)/;

/**
 * Converts a markdown preview into the small HTML subset the inbox displays.
 *
 * Block structure is kept flat: a preview is one or two lines under a title, so list items and
 * quotes render as marked lines rather than as nested `<ul>`/`<blockquote>` boxes that would
 * fight the list item's layout.
 */
export function renderPreviewMarkdown(text: string): string {
  if (typeof text !== 'string' || !text) return '';

  return text
    .split('\n')
    .map(line => {
      const marker = BLOCK_MARKER.exec(line);
      if (!marker) return renderInline(line);

      const rest = renderInline(line.slice(marker[0].length));
      // A bullet keeps its marker; a quote is shown as quoted text without the syntax.
      return marker[1] ? `<span class="courier-inbox-md-bullet">•</span> ${rest}` : `<em>${rest}</em>`;
    })
    .join('<br>');
}
