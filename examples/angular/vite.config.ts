import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [
    angular({
      // Like the other Vite examples, we alias the @trycourier packages to their
      // `src/`. Those files are plain TypeScript, not Angular code, so we tell
      // Analog's compiler to skip transforming them — otherwise its ngtsc-based
      // transform mangles the SDK's re-exports (e.g. `export { Courier }`) and the
      // production rollup build fails. Analog already skips node_modules; this
      // covers the aliased-to-source @trycourier packages too.
      transformFilter: (_code, id) => !id.includes('@trycourier')
    })
  ],
  define: {
    // __PACKAGE_VERSION__ is inlined from packages' respective package.json at build time.
    // We define it here for the example, since we depend on src (rather than the built dist).
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    include: [
      '@trycourier/courier-ui-inbox',
      '@trycourier/courier-js',
      '@trycourier/courier-ui-core'
    ]
  }
});
