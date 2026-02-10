---
"@trycourier/courier-ui-inbox": minor
---

Support inline hyperlinks and variables in inbox designer and inbox UI

- **Designer**: Add optional Variables (key/value) section; substitute `{{variableName}}` in title, body, and action labels/URLs before send. Body supports markdown-style links `[text](url)` which are converted to HTML for display.
- **Inbox UI**: Render message body/preview as sanitized HTML when it contains markup (e.g. `<a>` from inline links), so inline links are clickable; plain text continues to use textContent.
