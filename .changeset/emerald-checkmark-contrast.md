---
"@trycourier/courier-ui-core": patch
---

Fix the checkbox checkmark contrast pick: `isDarkColor` now computes true sRGB relative luminance (as its docs always claimed) instead of YIQ. Saturated mid-tone brand colors — e.g. the preferences page's emerald `#10B981`, which YIQ scored 0.5023 ("light" by a rounding error) — now correctly get a white checkmark instead of a black one.
