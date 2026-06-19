import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
//
// Unlike the `vue` example (which aliases `@trycourier/*` to live package
// `src/`), this example consumes the PUBLISHED `@trycourier/courier-vue`
// package exactly as an external app would: it is resolved from node_modules
// via its `exports`/`dist`, with no source aliasing. There is nothing
// Courier-specific to configure here beyond telling the Vue compiler to leave
// the `courier-*` custom elements alone.
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell the Vue compiler to treat any `courier-*` tag as a native custom
          // element rather than a Vue component, so it leaves them alone.
          isCustomElement: (tag) => tag.startsWith('courier-')
        }
      }
    })
  ],
  // Share the same credentials as the web-js example: load `.env` (VITE_USER_ID /
  // VITE_JWT) from examples/web-js instead of this directory, so you only configure
  // them once for the web-component examples.
  envDir: path.resolve(__dirname, '../web-js')
});
