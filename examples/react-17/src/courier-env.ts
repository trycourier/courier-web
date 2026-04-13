import type { CourierProps } from '@trycourier/courier-react'

/**
 * Shared signIn props for all example pages.
 *
 * Centralizes env-var reading so every page uses the same
 * userId, JWT, tenantId, and API URLs. Prevents 403 errors
 * caused by some pages omitting apiUrls and falling back to
 * production endpoints while the JWT targets a different backend.
 */
export function getSignInProps(overrides?: Partial<CourierProps>): CourierProps {
  return {
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    tenantId: import.meta.env.VITE_TENANT_ID || undefined,
    apiUrls: {
      courier: {
        rest: import.meta.env.VITE_COURIER_REST_URL,
        graphql: import.meta.env.VITE_COURIER_GRAPHQL_URL,
      },
      inbox: {
        graphql: import.meta.env.VITE_INBOX_GRAPHQL_URL,
        webSocket: import.meta.env.VITE_INBOX_WEBSOCKET_URL,
      },
    },
    ...overrides,
  };
}
