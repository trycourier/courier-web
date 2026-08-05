/**
 * Inbox wire protocol version negotiated per socket connection via `?iwpv=`.
 *
 * `v2` publishes the canonical message: the same object the GraphQL read returns,
 * with `trackingIds` at the root and no nested `data.trackingIds` duplicate. On
 * `v1` the socket left `trackingIds` nested under `data` while GraphQL returned
 * them at the root, so this SDK — which reads only the root — silently tracked
 * nothing for a message that arrived over the socket, while the same message
 * tracked fine after a refetch.
 *
 * The server downgrades an unrecognized version to the legacy protocol rather
 * than rejecting the connection, so this must not be raised ahead of the server
 * supporting it: a client asking for a version the server does not know gets the
 * legacy shape and no error. v2 frames carry `iwpv: "v2"` so a downgrade is
 * detectable rather than silent.
 */
export const INBOX_WIRE_PROTOCOL_VERSION = 'v2';
