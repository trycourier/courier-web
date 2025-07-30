import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
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
