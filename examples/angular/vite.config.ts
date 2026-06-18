import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

// How this example consumes the Courier Angular SDK
// --------------------------------------------------
// Unlike the React/Vue showcases (whose SDKs are plain TS aliased to `/src`),
// `@trycourier/courier-angular` is *Angular* source. Analog's compiler
// deliberately skips transforming `@trycourier/*` (see `transformFilter`
// below), so we cannot alias courier-angular to its `/src` — its decorators
// would never be compiled. Instead we consume the BUILT package: ng-packagr
// emits a partial-Ivy fesm2022 bundle that Angular's linker (run by Analog on
// node_modules) recompiles at build/dev time.
//
// We alias `@trycourier/courier-angular` to its `dist/` so Vite always picks up
// the freshly built output regardless of how the `file:` dependency was linked
// into node_modules. The dist folder ships its own package.json with a proper
// `exports`/`module` map pointing at the fesm2022 bundle. Its peer packages
// (courier-ui-inbox|toast|preferences, courier-js, courier-ui-core) are still
// aliased to `/src` below — exactly like the Vue example — so the example runs
// against live package source.
const courierAngularDist = path.resolve(
  __dirname,
  '../../@trycourier/courier-angular/dist'
);

export default defineConfig({
  plugins: [
    angular({
      // The aliased-to-source @trycourier packages are plain TypeScript, not
      // Angular code. Tell Analog's ngtsc transform to skip them — otherwise it
      // mangles the SDK's re-exports and the production rollup build fails.
      // (Analog already skips node_modules; courier-angular's dist is recompiled
      // by the Angular linker, which Analog applies to node_modules separately.)
      transformFilter: (_code, id) => !id.includes('@trycourier')
    })
  ],
  // Share the same credentials as the web-js example: load `.env` (VITE_USER_ID /
  // VITE_JWT) from examples/web-js instead of this directory, so you only configure
  // them once for the web-component examples.
  envDir: path.resolve(__dirname, '../web-js'),
  define: {
    // __PACKAGE_VERSION__ is inlined from packages' respective package.json at build time.
    // We define it here for the example, since we depend on src (rather than the built dist).
    "__PACKAGE_VERSION__": JSON.stringify("dev-version"),
  },
  server: {
    watch: {
      ignored: [
        '!../../@trycourier/courier-angular/dist/**',
        '!../../@trycourier/courier-ui-inbox/src/**',
        '!../../@trycourier/courier-ui-toast/src/**',
        '!../../@trycourier/courier-ui-preferences/src/**',
        '!../../@trycourier/courier-js/src/**',
        '!../../@trycourier/courier-ui-core/src/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@trycourier/courier-angular': courierAngularDist,
      '@trycourier/courier-ui-inbox': path.resolve(__dirname, '../../@trycourier/courier-ui-inbox/src'),
      '@trycourier/courier-ui-toast': path.resolve(__dirname, '../../@trycourier/courier-ui-toast/src'),
      '@trycourier/courier-ui-preferences': path.resolve(__dirname, '../../@trycourier/courier-ui-preferences/src'),
      '@trycourier/courier-js': path.resolve(__dirname, '../../@trycourier/courier-js/src'),
      '@trycourier/courier-ui-core': path.resolve(__dirname, '../../@trycourier/courier-ui-core/src')
    }
  },
  optimizeDeps: {
    // courier-angular ships partial-Ivy code that must be recompiled by the
    // Angular linker (handled by the Analog plugin), so it must NOT be
    // pre-bundled by esbuild — exclude it. Its plain-TS peers are aliased to
    // source and included so Vite optimizes them like the other examples.
    exclude: [
      '@trycourier/courier-angular'
    ],
    include: [
      '@trycourier/courier-ui-inbox',
      '@trycourier/courier-ui-toast',
      '@trycourier/courier-ui-preferences',
      '@trycourier/courier-js',
      '@trycourier/courier-ui-core'
    ]
  }
});
