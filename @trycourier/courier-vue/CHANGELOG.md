# @trycourier/courier-vue

## 1.1.1

### Patch Changes

- Updated dependencies [[`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`53396e7`](https://github.com/trycourier/courier-web/commit/53396e7c0484217b6a996b8768813f9703d4f053), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2)]:
  - @trycourier/courier-ui-core@2.5.0
  - @trycourier/courier-ui-inbox@2.7.0
  - @trycourier/courier-ui-toast@2.4.0
  - @trycourier/courier-js@3.7.0
  - @trycourier/courier-ui-preferences@1.3.1

## 1.1.0

### Minor Changes

- [#248](https://github.com/trycourier/courier-web/pull/248) [`10c5e71`](https://github.com/trycourier/courier-web/commit/10c5e716233ce5573f5d89cdd304a80f8186b6c7) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix named imports under Node ESM. `import { useCourier } from "@trycourier/courier-react"` threw `Named export 'useCourier' not found` in Astro, SvelteKit, Nuxt, Remix, and plain `node --input-type=module`.

  Each package now declares an `exports` map, so an `import` resolves to `dist/index.mjs` and a `require` resolves to the bundle `main` already pointed at. Node only consults `main` and never `module`, which is why the ESM build was reachable from bundlers but not from a server.

  The CommonJS bundles also carry their re-exported names as plain assignments now (`output.externalLiveBindings: false`). Rollup emitted a live-binding getter, terser minified it into a form `cjs-module-lexer` cannot read, and Node saw 7 of `courier-react`'s 27 names and none of `courier-js`'s. That is 26 of 26 for `courier-react` and 28 for `courier-vue` after the change.

  `main`, `module`, and `types` are unchanged, and every `dist/` path that named a real file still resolves.

  **One behavior change.** An `exports` map does no filename-extension guessing, so an extensionless deep import into `dist/` no longer resolves:

  ```ts
  // before
  import type { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";

  // after — the type is on the package's public surface
  import type { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js";
  ```

  Import from the package root, which exports every published type. Adding the `.d.ts` extension also works.

### Patch Changes

- Updated dependencies [[`10c5e71`](https://github.com/trycourier/courier-web/commit/10c5e716233ce5573f5d89cdd304a80f8186b6c7)]:
  - @trycourier/courier-js@3.6.0
  - @trycourier/courier-ui-core@2.4.0
  - @trycourier/courier-ui-inbox@2.6.0
  - @trycourier/courier-ui-toast@2.3.0
  - @trycourier/courier-ui-preferences@1.3.0

## 1.0.9

### Patch Changes

- Updated dependencies [[`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e)]:
  - @trycourier/courier-js@3.5.1
  - @trycourier/courier-ui-core@2.3.1
  - @trycourier/courier-ui-preferences@1.2.2
  - @trycourier/courier-ui-inbox@2.5.3
  - @trycourier/courier-ui-toast@2.2.1

## 1.0.8

### Patch Changes

- Updated dependencies [[`6cfcf8c`](https://github.com/trycourier/courier-web/commit/6cfcf8c1dba780d4fee306dbfa0aa7f3590720cf), [`6cfcf8c`](https://github.com/trycourier/courier-web/commit/6cfcf8c1dba780d4fee306dbfa0aa7f3590720cf)]:
  - @trycourier/courier-ui-inbox@2.5.2
  - @trycourier/courier-ui-toast@2.2.0

## 1.0.7

### Patch Changes

- Updated dependencies [[`c346faa`](https://github.com/trycourier/courier-web/commit/c346faa5c1d66fc2015e304d600d202561df4615)]:
  - @trycourier/courier-ui-inbox@2.5.1

## 1.0.6

### Patch Changes

- Updated dependencies [[`0efd6f1`](https://github.com/trycourier/courier-web/commit/0efd6f134a768762c1496bd6baa9ec1d76172279)]:
  - @trycourier/courier-ui-inbox@2.5.0

## 1.0.5

### Patch Changes

- Updated dependencies [[`b530bee`](https://github.com/trycourier/courier-web/commit/b530bee8b7820ee3313c29e20f8238e3dbba458b)]:
  - @trycourier/courier-ui-toast@2.1.12

## 1.0.4

### Patch Changes

- Updated dependencies [[`ad996b3`](https://github.com/trycourier/courier-web/commit/ad996b35e1498f61565c864bc5be407db48bb90e)]:
  - @trycourier/courier-ui-toast@2.1.11

## 1.0.3

### Patch Changes

- Updated dependencies [[`70817ee`](https://github.com/trycourier/courier-web/commit/70817ee5f88ebbec3268d25e593d6214cde59fc5)]:
  - @trycourier/courier-ui-toast@2.1.10

## 1.0.2

### Patch Changes

- Updated dependencies [[`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f)]:
  - @trycourier/courier-ui-core@2.3.0
  - @trycourier/courier-ui-toast@2.1.9
  - @trycourier/courier-ui-inbox@2.4.10
  - @trycourier/courier-ui-preferences@1.2.1

## 1.0.1

### Patch Changes

- [#210](https://github.com/trycourier/courier-web/pull/210) [`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343) Thanks [@mikemilla](https://github.com/mikemilla)! - Republish with corrected packaging: publish the ng-packagr dist output via `publishConfig.directory` (angular) and keep test files out of the published package (vue). The 1.0.0 release predated these fixes.

- Updated dependencies [[`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343)]:
  - @trycourier/courier-js@3.5.0
  - @trycourier/courier-ui-preferences@1.2.0
  - @trycourier/courier-ui-inbox@2.4.9
  - @trycourier/courier-ui-toast@2.1.8
