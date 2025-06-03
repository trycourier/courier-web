import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: ['!../../@trycourier/courier-react/src/**', '!../../@trycourier/courier-ui-inbox/src/**', '!../../@trycourier/courier-js/src/**']
    }
  },
  resolve: {
    alias: {
      '@trycourier/courier-react': path.resolve(__dirname, '../../@trycourier/courier-react/src'),
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src')
    }
  },
  optimizeDeps: {
    force: true,
    include: ['@trycourier/courier-react', '@trycourier/courier-ui-inbox', '@trycourier/courier-js']
  }
});