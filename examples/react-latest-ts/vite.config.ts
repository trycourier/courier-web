import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@trycourier/courier-react': '@trycourier/courier-react/src',
      '@trycourier/courier-ui-inbox': '@trycourier/courier-ui-inbox/src',
      '@trycourier/courier-js': '@trycourier/courier-js/src'
    }
  }
})
