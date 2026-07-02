---
"@trycourier/courier-ui-preferences": minor
"@trycourier/courier-react-components": minor
"@trycourier/courier-react": minor
"@trycourier/courier-react-17": minor
"@trycourier/courier-vue": minor
"@trycourier/courier-angular": minor
---

feat(preferences): support per-component `tenantId` on `CourierPreferences`

The `tenant-id` attribute on the `<courier-preferences>` web component was observed but inert. It now scopes the preference page (and the inline recipient preferences) to that account via `getPreferencePage({ accountId })`, changing the tenant re-fetches, and it falls back to the tenant set at `signIn` when omitted.

Exposed as a `tenantId` prop on the React (`@trycourier/courier-react`, `@trycourier/courier-react-17`), Vue, and Angular `CourierPreferences` wrappers, restoring the per-component tenant scoping that v7 `PreferencesV4` offered.
