import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@trycourier/courier-react': path.resolve(__dirname, '../../@trycourier/courier-react/src'),
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      '@trycourier/courier-react',
      '@trycourier/courier-ui-inbox',
      '@trycourier/courier-js',
      '@trycourier/courier-ui-core',
      'object-assign'
    ]
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-react/src/**',
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  }
})
