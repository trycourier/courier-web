import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CourierUIInbox',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        '@trycourier/courier-js',
      ],
      output: {
        globals: {
          '@trycourier/courier-js': 'CourierJS',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
    }) as PluginOption,
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      sourcemap: true,
      filename: 'stats.html'
    }) as PluginOption,
  ],
  resolve: {
    alias: process.env.DEV_ALIAS
      ? { '@trycourier/courier-js': '@trycourier/courier-js/src' }
      : {},
  }
});