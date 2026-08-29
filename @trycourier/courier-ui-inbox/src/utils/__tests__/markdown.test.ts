import { renderPreviewMarkdown } from "../markdown";
import { sanitizeHtmlForInbox } from "../sanitize-html";

/** What the reader ends up seeing: the renderer's output after sanitizing. */
function render(markdown: string): string {
  return sanitizeHtmlForInbox(renderPreviewMarkdown(markdown));
}

describe('preview markdown', () => {

  // The vocabulary below is the one the backend's markdown serializer actually emits,
  // confirmed against live inbox output.
  it('renders bold, in both spellings the serializer produces', () => {
    expect(render('x **bold** y')).toBe('x <strong>bold</strong> y');
    expect(render('x __bold__ y')).toBe('x <strong>bold</strong> y');
  });

  it('renders italic', () => {
    expect(render('x _ital_ y')).toBe('x <em>ital</em> y');
    expect(render('x *ital* y')).toBe('x <em>ital</em> y');
  });

  it('renders strikethrough', () => {
    expect(render('x ~~gone~~ y')).toBe('x <s>gone</s> y');
  });

  it('nests emphasis', () => {
    expect(render('**bold _and_ italic**')).toBe('<strong>bold <em>and</em> italic</strong>');
  });

  it('keeps links clickable', () => {
    expect(render('see [docs](https://www.courier.com)')).toContain('<a href="https://www.courier.com"');
    expect(render('see [docs](https://www.courier.com)')).toContain('>docs</a>');
  });

  it('still linkifies a bare url', () => {
    expect(render('go to https://www.courier.com now')).toContain('<a href="https://www.courier.com"');
  });

  it('marks up quotes and bullets without nesting block elements', () => {
    expect(render('> quoted')).toBe('<em>quoted</em>');
    expect(render('+ alpha')).toContain('alpha');
    expect(render('+ alpha')).toContain('courier-inbox-md-bullet');
  });

  it('keeps line breaks', () => {
    expect(render('one\ntwo')).toBe('one<br>two');
  });

  // Prose is not markdown just because it contains a delimiter character.
  it('leaves arithmetic and snake_case alone', () => {
    expect(render('5 * 3 * 2 = 30')).toBe('5 * 3 * 2 = 30');
    expect(render('set user_id_field to 4')).toBe('set user_id_field to 4');
  });

  it('escapes html rather than rendering it', () => {
    expect(render('<img src=x onerror=alert(1)>')).not.toContain('<img');
    expect(render('**<script>bad()</script>**')).toBe('<strong>&lt;script&gt;bad()&lt;/script&gt;</strong>');
  });

  it('returns empty for empty input', () => {
    expect(render('')).toBe('');
  });

  // A preview is only markdown by convention — a template can put plain prose in the slot, and
  // an author writing prose has not opted into any of the above.
  it('passes plain prose through untouched', () => {
    expect(render('Your order shipped and arrives Friday.')).toBe('Your order shipped and arrives Friday.');
    expect(render('Terms apply*')).toBe('Terms apply*');
    expect(render('Use case: 50% off')).toBe('Use case: 50% off');
  });

  it('escapes the characters prose really contains', () => {
    // Escaped in the markup, which is how the reader sees the literal character.
    expect(render("Don't miss it, Tom & Jerry")).toBe('Don&#039;t miss it, Tom &amp; Jerry');
    expect(render('3 < 5')).toBe('3 &lt; 5');
  });

  // Only an http(s) url is a link. An email address or a bare host is left as text rather than
  // guessed at, since neither can be turned into an href without inventing a scheme.
  it('does not invent links', () => {
    expect(render('Reply to team@courier.com')).toBe('Reply to team@courier.com');
    expect(render('Visit www.courier.com today')).toBe('Visit www.courier.com today');
  });

  // The one place plain prose is read as markdown: a leading marker is a block marker wherever
  // it appears, so prose that opens a line with it renders as a bullet or a quote. Documented
  // rather than guarded — a line starting "- " is a list far more often than it is not.
  it('reads a leading marker as a block marker, even in prose', () => {
    expect(render('- Milk')).toContain('courier-inbox-md-bullet');
    expect(render('> not a quote, just a chevron')).toBe('<em>not a quote, just a chevron</em>');
  });
});
