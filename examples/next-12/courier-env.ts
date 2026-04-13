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
    userId: process.env.NEXT_PUBLIC_USER_ID!,
    jwt: process.env.NEXT_PUBLIC_JWT!,
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID || undefined,
    apiUrls: {
      courier: {
        rest: process.env.NEXT_PUBLIC_COURIER_REST_URL!,
        graphql: process.env.NEXT_PUBLIC_COURIER_GRAPHQL_URL!,
      },
      inbox: {
        graphql: process.env.NEXT_PUBLIC_INBOX_GRAPHQL_URL!,
        webSocket: process.env.NEXT_PUBLIC_INBOX_WEBSOCKET_URL!,
      },
    },
    ...overrides,
  };
}
