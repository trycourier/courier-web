import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer'

const NAME = 'CourierJS';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: 'umd',
          entryFileNames: 'index.js',
          name: NAME,
        },

        // ESM for use with bundlers via npm
        {
          format: 'es',
          entryFileNames: 'index.mjs',
        },

        // CDN build
        // courier-js has no dependencies, so we don't need to replace import paths with versioned CDN URLs
        // We still host it on the CDN with a path consistent with other CDN-hosted packages
        {
          format: 'es',
          entryFileNames: 'index.cdn.js',
        }
      ]
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    },
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.test.ts',
        'src/jest.setup.ts',
      ],
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
