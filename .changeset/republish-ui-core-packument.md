---
"@trycourier/courier-ui-core": patch
---

Republish `@trycourier/courier-ui-core` to repair the broken 2.5.0 npm packument (#257).

The 2.5.0 tarball uploaded during the 9.3.1 release but never landed in the registry packument — `dist-tags.latest` stayed at 2.4.0 and 2.5.0 is absent from the versions map, so npm/pnpm/yarn cannot resolve it (`ERR_PNPM_NO_MATCHING_VERSION`). Because every internal package pins ui-core at an exact `2.5.0`, this makes `courier-react@9.3.1` and the rest of the current train uninstallable for fresh clients.

A version can't be re-published to npm, so this cuts a clean `courier-ui-core@2.5.1`. `updateInternalDependencies: "patch"` cascades patch bumps to every dependent (courier-react, courier-react-17, courier-ui-inbox, courier-ui-toast, courier-ui-preferences, courier-react-components, courier-vue, courier-angular) and rewrites their pinned `2.5.0` ranges to `2.5.1`, restoring an installable `latest` across the board.
