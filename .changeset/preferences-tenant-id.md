---
"@trycourier/courier-js": minor
"@trycourier/courier-ui-preferences": minor
"@trycourier/courier-react-components": minor
"@trycourier/courier-react": minor
"@trycourier/courier-react-17": minor
"@trycourier/courier-vue": minor
"@trycourier/courier-angular": minor
---

feat(preferences): support per-component `tenantId` on `CourierPreferences`

The `tenant-id` attribute on the `<courier-preferences>` web component was observed but inert. It now scopes preferences to that account for both reads and writes, matching v7 `PreferencesV4`:

- Reads: passed as `accountId` to `getPreferencePage`, scoping the preference page and the inline recipient preferences. Changing the tenant re-fetches.
- Writes: `putUserPreferenceTopic` now accepts an optional `accountId`, and the component threads its tenant through every write (status, custom routing, digest schedule). Falls back to the tenant set at `signIn` when omitted.

Exposed as a `tenantId` prop on the React (`@trycourier/courier-react`, `@trycourier/courier-react-17`), Vue, and Angular `CourierPreferences` wrappers.
