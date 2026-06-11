---
"@trycourier/courier-js": patch
---

Prevent GraphQL injection in the inbox, preference, and brand clients.

User- and server-supplied values (message ids, tracking ids, topic ids, brand ids, tenant/account ids, filter tags, `from` cursors, and digest schedules) were interpolated directly into inline GraphQL query strings. A value containing a `"` could break out of its string literal and inject arbitrary GraphQL.

All such values are now escaped for their GraphQL context: string literals are escaped via a new `escapeGraphQLString` helper, booleans are rendered as literal `true`/`false`, and unquoted enum positions (preference status and channel routing values) are validated to contain only GraphQL name characters.
