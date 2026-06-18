/// <reference types="vite/client" />

// Injected by Vite's `define` (see vite.config.ts). The aliased `@trycourier/courier-vue`
// source references this global, so we declare it here for type-checking.
declare const __PACKAGE_VERSION__: string;

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_USER_ID: string;
  readonly VITE_JWT: string;
  readonly VITE_COURIER_REST_URL: string;
  readonly VITE_COURIER_GRAPHQL_URL: string;
  readonly VITE_INBOX_GRAPHQL_URL: string;
  readonly VITE_INBOX_WEBSOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
