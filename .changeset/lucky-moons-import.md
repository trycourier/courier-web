---
"@trycourier/courier-js": minor
"@trycourier/courier-ui-core": minor
"@trycourier/courier-ui-inbox": minor
"@trycourier/courier-ui-toast": minor
"@trycourier/courier-ui-preferences": minor
"@trycourier/courier-react-components": minor
"@trycourier/courier-react": minor
"@trycourier/courier-react-17": minor
"@trycourier/courier-vue": minor
---

Fix named imports under Node ESM. `import { useCourier } from "@trycourier/courier-react"` threw `Named export 'useCourier' not found` in Astro, SvelteKit, Nuxt, Remix, and plain `node --input-type=module`.

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
