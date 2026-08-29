import { renderPreviewMarkdown } from "../markdown";
import { sanitizeHtmlForInbox } from "../sanitize-html";

/**
 * The preview renderer is ours rather than a markdown library, so the guarantees a library would
 * come with have to be demonstrated here instead.
 *
 * The load-bearing one is that the renderer is not the security boundary. Its output is rebuilt
 * from a parsed DOM tree by `sanitizeHtmlForInbox`, which reconstructs an allowlist of tags and
 * emits attributes itself rather than passing any through — so a bug in the renderer is a
 * rendering bug, not an injection. These tests assert that structurally, against what a browser
 * would actually build, rather than by grepping the output for scary substrings.
 */

const ALLOWED_TAGS = new Set(['A', 'STRONG', 'EM', 'S', 'BR', 'SPAN']);
const ALLOWED_ATTRS = new Set(['href', 'target', 'rel', 'class', 'style']);

function render(markdown: string): string {
  return sanitizeHtmlForInbox(renderPreviewMarkdown(markdown));
}

/** Everything about the rendered tree that should never happen. */
function violations(html: string): string[] {
  const found: string[] = [];

  new DOMParser().parseFromString(html, 'text/html').body.querySelectorAll('*').forEach(el => {
    if (!ALLOWED_TAGS.has(el.tagName)) {
      found.push(`tag:${el.tagName}`);
    }

    for (const attribute of Array.from(el.attributes)) {
      if (!ALLOWED_ATTRS.has(attribute.name)) {
        found.push(`attr:${el.tagName}[${attribute.name}]`);
      }
    }

    // The only attribute carrying a URL, and the only scheme worth following.
    if (el.tagName === 'A' && !/^https?:\/\//i.test(el.getAttribute('href') ?? '')) {
      found.push(`href:${el.getAttribute('href')}`);
    }
  });

  return found;
}

describe('preview markdown safety', () => {

  it.each([
    ['a script tag', '<script>alert(1)</script>'],
    ['a script tag inside emphasis', '**<script>alert(1)</script>**'],
    ['an event handler', '<img src=x onerror=alert(1)>'],
    ['a javascript url in link syntax', '[click](javascript:alert(1))'],
    ['a data url in link syntax', '[click](data:text/html,<script>alert(1)</script>)'],
    ['an attribute broken out of', '[a](https://x.com" onmouseover="alert(1))'],
    ['a closing tag mid-emphasis', '*a</a><iframe src=x>b*'],
    ['an svg payload', '<svg/onload=alert(1)>'],
    ['an entity-encoded scheme', '[a](&#106;avascript:alert(1))'],
  ])('renders %s inertly', (_name, input) => {
    expect(violations(render(input))).toEqual([]);
  });

  // A regex renderer's characteristic failure is catastrophic backtracking on input that almost
  // matches. Cost stays linear, so a hostile preview cannot hang the list.
  it('stays linear on input built to make it backtrack', () => {
    const inputs = [
      '*'.repeat(20000),
      '_'.repeat(20000),
      '**'.repeat(10000),
      '~~'.repeat(10000),
      '['.repeat(20000),
      '[a]('.repeat(5000),
      '*'.repeat(5000) + 'a' + '*'.repeat(5000),
      '**' + 'a '.repeat(10000)
    ];

    const started = Date.now();
    inputs.forEach(input => expect(typeof render(input)).toBe('string'));

    // Generous next to the ~35ms these actually take, so the bound catches a blowup rather than
    // a slow machine.
    expect(Date.now() - started).toBeLessThan(5000);
  });

  it('never escapes the allowlist, whatever it is fed', () => {
    // Seeded rather than random, so a failure is reproducible from the reported input.
    let seed = 12345;
    const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

    const pieces = [
      ...'*_~[]()<>&"\'`#!\\/:.- abc\n',
      'http://', 'https://', 'javascript:', 'data:text/html,',
      '<script>', '</a>', '<img src=x', 'onerror=x', '](', ')['
    ];

    for (let i = 0; i < 5000; i++) {
      let input = '';
      for (let j = Math.floor(next() * 40); j > 0; j--) {
        input += pieces[Math.floor(next() * pieces.length)];
      }

      const rendered = render(input);
      expect({ input, violations: violations(rendered) }).toEqual({ input, violations: [] });
      // Sanitizing again changes nothing, so the output is a fixed point rather than something
      // that keeps unfolding when a browser re-parses it.
      expect(sanitizeHtmlForInbox(rendered)).toBe(rendered);
    }
  });
});
