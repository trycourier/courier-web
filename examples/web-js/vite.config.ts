import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  define: {
    // __PACKAGE_VERSION__ is inlined from packages' respective package.json at build time.
    // We define it here for the example, since we depend on src (rather than the built dist).
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      '@trycourier/courier-ui-inbox',
      '@trycourier/courier-js',
      '@trycourier/courier-ui-core'
    ]
  }
});
