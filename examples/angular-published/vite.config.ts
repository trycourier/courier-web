import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

// How this example consumes the Courier Angular SDK
// --------------------------------------------------
// This example consumes the PUBLISHED `@trycourier/courier-angular` package —
// its peer packages (courier-ui-inbox|toast|preferences, courier-js,
// courier-ui-core) all resolve from node_modules via their `exports`/`dist`,
// with no source aliasing, exactly as an external app would get them.
//
// `@trycourier/courier-angular` is the one special case: it is built with
// ng-packagr, which writes the package manifest (the `exports`/`module` map)
// into `dist/`. On npm that `dist` manifest *is* the package root, but inside
// this monorepo the workspace root has no such manifest, so Vite can't resolve
// the bare entry. We therefore alias the bare specifier to its built `dist/` —
// i.e. the same published artifact an npm consumer receives. The bundle is
// partial-Ivy and must be recompiled by Angular's linker (run by Analog), so we
// also (a) tell Analog's ngtsc transform to skip `@trycourier` and (b) exclude
// it from esbuild's pre-bundling.
const courierAngularDist = path.resolve(
  __dirname,
  '../../@trycourier/courier-angular/dist'
);

export default defineConfig({
  plugins: [
    angular({
      transformFilter: (_code, id) => !id.includes('@trycourier')
    })
  ],
  // Share the same credentials as the web-js example: load `.env` (VITE_USER_ID /
  // VITE_JWT) from examples/web-js instead of this directory, so you only configure
  // them once for the web-component examples.
  envDir: path.resolve(__dirname, '../web-js'),
  resolve: {
    alias: {
      '@trycourier/courier-angular': courierAngularDist
    }
  },
  optimizeDeps: {
    // courier-angular ships partial-Ivy code that must be recompiled by the
    // Angular linker (handled by the Analog plugin), so it must NOT be
    // pre-bundled by esbuild — exclude it.
    exclude: ['@trycourier/courier-angular']
  }
});
