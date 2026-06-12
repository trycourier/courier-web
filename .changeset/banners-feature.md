---
"@trycourier/courier-ui-banner": minor
"@trycourier/courier-js": minor
"@trycourier/courier-react-components": minor
"@trycourier/courier-react": minor
---

Add `@trycourier/courier-ui-banner` — a new banner package modeled on `courier-ui-toast`.

- `<courier-banner>` web component with `banner` (inline strip), `popup` (overlay card), and `custom` (consumer-rendered) layouts.
- Theme support via `CourierBannerThemeManager` (light/dark/system); custom components bypass the theme, mirroring inbox custom list items.
- Single banner visible at a time with a FIFO queue (`maxVisible`), `dismissible` / `requireAction` for gated popups, and custom rendering via `setBannerItem` / `setBannerItemContent`.
- React wrapper `<CourierBanner>` (`@trycourier/courier-react`) with `renderBannerItem` / `renderBannerItemContent` render props.
- Honors message expiry: `InboxMessage.expiresAt` (also surfaced `pinned`) is read from the top-level field or `data.expiresAt`; already-expired banners are dropped and future-dated ones auto-remove at expiry.
