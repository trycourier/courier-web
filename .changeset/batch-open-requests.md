---
"@trycourier/courier-js": patch
"@trycourier/courier-ui-inbox": patch
"@trycourier/courier-react-components": patch
---

Batch open requests to reduce network overhead. Multiple messages becoming visible within a short window are now collected and sent to the server in a single GraphQL mutation instead of individual requests per message.
