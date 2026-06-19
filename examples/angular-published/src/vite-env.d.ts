/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_ID?: string;
  readonly VITE_JWT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
