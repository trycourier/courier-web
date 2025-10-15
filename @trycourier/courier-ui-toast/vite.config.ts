import { defineConfig, PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import packageJson from "./package.json";

export default defineConfig({
  define: {
    "__PACKAGE_VERSION__": JSON.stringify(packageJson.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CourierUIToast',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        '@trycourier/courier-js',
        '@trycourier/courier-ui-core',
      ],
      output: {
        globals: {
          '@trycourier/courier-js': 'CourierJS',
          '@trycourier/courier-ui-core': 'CourierUICore',
        },
      },
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
