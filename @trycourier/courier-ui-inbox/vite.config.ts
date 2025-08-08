import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json';
import { getCDNUrl } from '../../scripts/build/cdn';
import { UMD_GLOBALS } from '../../scripts/build/umd-globals';
import { getDependencyVersion } from '../../scripts/build/dependencies';

const NAME = 'CourierUIInbox';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: (id) => deps.some(dep => id === dep || id.startsWith(`${dep}/`)),
      output: [
        {
          format: 'umd',
          entryFileNames: 'index.js',
          name: NAME,
          globals: (id) => UMD_GLOBALS[id],
        },

        // ESM for use with bundlers via npm
        {
          format: 'es',
          entryFileNames: 'index.mjs',
        },

        // CDN build
        {
          format: 'es',
          entryFileNames: 'index.cdn.js',

          // Replaces import paths (ex. @trycourier/courier-js) with versioned URL pointing to a CDN
          paths: (id) => {
            const version = getDependencyVersion(pkg, id);
            return getCDNUrl(id, version);
          },
        }
      ]
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    },
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
  ]
});
