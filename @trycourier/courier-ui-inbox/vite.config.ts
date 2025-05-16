import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CourierUIInbox',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@trycourier/courier-js'], // Add courier-js as external
      output: {
        globals: {
          '@trycourier/courier-js': 'CourierJS', // Ensure the global name matches
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
});