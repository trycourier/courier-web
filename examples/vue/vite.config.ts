import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
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
  envDir: path.resolve(__dirname, '../web-js'),
  define: {
    // __PACKAGE_VERSION__ is inlined from packages' respective package.json at build time.
    // We define it here for the example, since we depend on src (rather than the built dist).
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  resolve: {
    alias: {
      '@trycourier/courier-vue': path.resolve(__dirname, '../../@trycourier/courier-vue/src'),
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-ui-toast': path.resolve(__dirname, '../../@trycourier/courier-ui-toast/src'),
      '@trycourier/courier-ui-preferences': path.resolve(__dirname, '../../@trycourier/courier-ui-preferences/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      '@trycourier/courier-vue',
      '@trycourier/courier-ui-inbox',
      '@trycourier/courier-ui-toast',
      '@trycourier/courier-ui-preferences',
      '@trycourier/courier-js',
      '@trycourier/courier-ui-core'
    ]
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-vue/src/**',
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-ui-toast/src/**',
        '!../../@trycourier/courier-ui-preferences/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  }
});
