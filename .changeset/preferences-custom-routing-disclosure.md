---
"@trycourier/courier-ui-preferences": minor
---

Rework per-topic channel customization into a collapsible disclosure: an arrow
row that expands to enable custom routing and reveal the channel chips, and
collapses to fall back to the topic's default routing. The expanded label
defaults to the collapsed `customizeLabel` and can be overridden via the new
`customizeActiveLabel` setter.
