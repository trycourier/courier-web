import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CourierUIInbox',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@trycourier/courier-js'],
      output: {
        globals: {
          '@trycourier/courier-js': 'CourierJS',
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      '@trycourier/courier-js': '@trycourier/courier-js/src'
    }
  }
});