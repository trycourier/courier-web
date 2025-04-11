import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['!**/node_modules/@trycourier/**']
    }
  },
  resolve: {
    alias: {
      '@trycourier/courier-ui-core': '@trycourier/courier-ui-core/src',
      '@trycourier/courier-ui-inbox': '@trycourier/courier-ui-inbox/src',
      '@trycourier/courier-js': '@trycourier/courier-js/src'
    }
  }
});