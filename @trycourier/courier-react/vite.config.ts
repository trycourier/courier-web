import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'CourierReact',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@trycourier/courier-ui-inbox',
        '@trycourier/courier-js',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@trycourier/courier-ui-inbox': 'CourierUIInbox',
          '@trycourier/courier-js': 'CourierJS',
        },
      },
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.tsx'],
    }) as PluginOption,
  ],
});