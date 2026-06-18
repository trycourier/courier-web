---
name: sync-examples
description: Keep the framework-SDK showcase example apps (react-latest, react-17, vue, and angular) at feature parity — the same set of demo pages and routes, one per SDK. Use whenever you add, change, or remove a demo in one showcase example (a new route/page, a themed variant, a custom-renderer demo, etc.) so the change is mirrored across the others, or when auditing that the showcases are in sync.
---

# Keep the showcase examples in sync

A subset of `examples/*` are **framework-SDK showcases**: the same catalogue of inbox / popup-menu / toast / preferences / hooks demos, each built on that framework's native Courier SDK. They are meant to stay at **feature parity** — every demo that exists in one should exist in all, at the same route, demonstrating the same thing.

| Example         | SDK package                   | Router          | Render-prop form |
| --------------- | ----------------------------- | --------------- | ---------------- |
| `react-latest`  | `@trycourier/courier-react`    | react-router-dom | JSX |
| `react-17`      | `@trycourier/courier-react-17` | react-router-dom | JSX |
| `vue`           | `@trycourier/courier-vue`      | vue-router      | `h()` functions |
| `angular`       | `@trycourier/courier-angular`* | Angular router  | `TemplateRef` / `@ContentChild` |

\* `courier-angular` may not exist yet — only sync the examples whose SDK ships.

**`react-latest` is the source of truth.** It has the most complete catalogue. When syncing, diff against it: any route/page it has, the others should have too (translated to their framework).

> The non-showcase examples — `web-js` (vanilla web-components playground), `next-latest`, `next-12` (SSR-focused), and `designer` — are NOT part of this parity contract. Don't force their structure to match.

## The parity contract

1. **Same route paths.** Each showcase's router must expose the identical set of paths as `react-latest/src/App.tsx`. The `Examples` index page links to every route; the `Home` page is the entry point.
2. **Same demos.** Each route renders the framework-native equivalent of the same react-latest page — same feature, same copy (with the framework name swapped), same inline styling/intent.
3. **Same credentials wiring.** Authenticate with `VITE_USER_ID` / `VITE_JWT` (Vite) or `NEXT_PUBLIC_*` (Next). `vue`/`angular`/`web-js` share one `.env` via Vite's `envDir: ../web-js`; see [add-example-app](../add-example-app/SKILL.md).

## Workflow: porting a change across showcases

When you add/change a demo in one showcase (usually `react-latest`):

1. **Capture the route + page.** Note the new `<Route path>` and read the page component fully.
2. **For each other showcase that ships its SDK**, create the equivalent page and register the same route. Apply the translation rules below.
3. **Update that showcase's `Examples` index** so the new demo is linked (and `Home` if relevant).
4. **Build each touched showcase** (see Verify). Don't leave a showcase half-ported.

## React → Vue translation (`courier-react` → `courier-vue`)

`courier-vue` re-exports the **same names** as `courier-react` (components `CourierInbox` / `CourierInboxPopupMenu` / `CourierToast` / `CourierPreferences`, `useCourier`, all theme types & utilities, `defaultFeeds`, etc.). Only the import specifier changes. Then:

- **`useCourier()`** returns `{ shared, auth, inbox, toast, preferences }` where `auth`, `inbox`, `toast` are Vue `shallowRef`s. Use `.value` in `<script setup>` (`auth.value.signIn(...)`, `inbox.value.totalUnreadCount`); templates auto-unwrap (`{{ inbox.totalUnreadCount }}`). `shared` and `preferences` are plain objects.
- **Render props** (`renderHeader`, `renderListItem`, `renderEmptyState`, `renderLoadingState`, `renderErrorState`, `renderPaginationItem`, `renderMenuButton`, `renderToastItem`, `renderToastItemContent`) take a function returning a Vue node built with `h()` instead of JSX. Same factory-prop argument, same prop names.
- **Theme / feeds / channelLabels** are passed as plain objects — do **not** `JSON.stringify` (the component handles it): `<CourierInbox :light-theme="theme" mode="light" />`.
- **Element ref** (react-latest `ElementRef.tsx` reaches the underlying web component via a React ref): use a template ref to the component and call the exposed `getElement()`.
- **Idioms**: `useState`→`ref`; `useEffect(fn, [])`→`onMounted`; `useEffect(fn, [deps])`→`watch`; `react-router-dom` (`BrowserRouter`/`Routes`/`Route`/`Link`/`useNavigate`) → `vue-router` (`createRouter`/`createWebHistory`, `<router-link>`, `useRouter().push`). Pages are `<script setup lang="ts">` SFCs; `App.vue` renders `<router-view />`; routes live in `src/router.ts`.

## React 18 → React 17 (`courier-react` → `courier-react-17`)

Nearly mechanical: swap the import specifier to `@trycourier/courier-react-17` and pin React 17-compatible deps. The component/hook API is identical; the only real difference is the SDK's internal render bridge (legacy `ReactDOM.render` vs `createRoot`), which is invisible to the example. Keep page code otherwise identical.

## Verify

```bash
# Route parity — the path lists should match (modulo framework syntax):
grep -oE 'path="[^"]+"' examples/react-latest/src/App.tsx | sort
grep -oE "path: '[^']+'" examples/vue/src/router.ts | sort

# Each touched showcase must build cleanly:
yarn workspace react-latest run build
yarn workspace vue run build
```

If `@trycourier/*` modules fail to resolve, build the packages first — see [sync-packages](../sync-packages/SKILL.md).

## Related

- [add-example-app](../add-example-app/SKILL.md) — scaffolding & registering a brand-new example.
- [run-example-app](../run-example-app/SKILL.md) — running a showcase to eyeball parity.
