/// <reference types="vite/client" />

// Injected by Vite's `define` (see vite.config.ts). The aliased-to-source
// @trycourier packages reference this global, so we declare it here for
// type-checking.
declare const __PACKAGE_VERSION__: string;

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_USER_ID?: string;
  readonly VITE_JWT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
