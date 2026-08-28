---
"@trycourier/courier-js": minor
"@trycourier/courier-ui-core": minor
"@trycourier/courier-ui-inbox": minor
"@trycourier/courier-ui-toast": minor
---

Render the button style a message action asks for, track action clicks, and render markdown previews

Inbox and toast actions now respect the styling their template configured. `style: "secondary"`
or `"tertiary"` draws the action's colour as an outline instead of a fill, matching how the same
action renders in email, and `style: "link"` renders as an inline link rather than a button. A
filled and an outlined action in the same row sit at the same height. This needed the inbox query
to ask for `style`, which it never did — that is why every action previously rendered filled.

Action styling is themable through a new `actions` block on the inbox and toast list item themes,
with `outlined` and `link` sub-blocks for the two other looks. A value set on the theme outranks
the one the action carries, so an untouched theme renders what the template configured and a set
one overrides it. The shipped default themes therefore no longer define `actions` at all — the
defaults come from the button, per mode, so integrators reading
`defaultLightTheme.inbox.list.item.actions` now get `undefined`.

Clicking an action reports the click to Courier automatically, using the tracking id the action
carries. `markActionAsClicked(action, messageId)` is exported for custom list item renderers.

A message's title and preview are rendered as markdown — bold, italic, strikethrough, links,
quotes and list markers — because the inbox channel serializes its preview through markdown.
Plain text is unaffected.
