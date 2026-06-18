/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_USER_ID?: string;
  readonly VITE_JWT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
