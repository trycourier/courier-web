import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'CourierReact',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
  },
  resolve: {
    dedupe: [
      '@trycourier/courier-js',
      '@trycourier/courier-ui-inbox',
    ]
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.tsx'],
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
});