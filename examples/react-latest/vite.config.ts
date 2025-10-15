import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  define: {
    // __PACKAGE_VERSION__ is inlined from packages' respective package.json at build time.
    // We define it here for the example, since we depend on src (rather than the built dist).
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@trycourier/courier-react': path.resolve(__dirname, '../../@trycourier/courier-react/src'),
      '@trycourier/courier-react-components': path.resolve(__dirname, '../../@trycourier/courier-react-components/src'),
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-ui-toast': path.resolve(__dirname, '../../@trycourier/courier-ui-toast/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    force: true,
    include: ['@trycourier/courier-react-components', '@trycourier/courier-react', '@trycourier/courier-ui-inbox', '@trycourier/courier-ui-toast', '@trycourier/courier-js', '@trycourier/courier-ui-core']
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-react/src/**',
        '!../../@trycourier/courier-react-components/src/**',
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-ui-toast/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  }
})
