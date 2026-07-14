---
name: update-component-theme
description: Change or add a themable style (border, color, shadow, radius, font) on a Courier UI web component — inbox, toast, preferences, or core. Use when adjusting a component's default look, adding a new theme property, or fixing a style that doesn't render in light or dark mode.
---

# Update a component theme property

The `@trycourier/courier-ui-*` packages style their web components through a theme object, not per-element CSS. Every default style change touches the same few places; this skill walks them in order.

## Where things live

For a package `<pkg>` (e.g. `courier-ui-toast`):

| What | Where |
| --- | --- |
| Theme types + defaults | `@trycourier/<pkg>/src/types/<component>-theme.ts` — `defaultLightTheme`, `defaultDarkTheme`, `mergeTheme` |
| CSS that consumes the theme | The component's `getStyles(theme)` (e.g. `src/components/courier-toast.ts`) — styles are injected globally, keyed by element id |
| Color palette | `@trycourier/courier-ui-core/src/utils/courier-colors.ts` (`CourierColors`) |

## Rules of thumb

1. **Pick colors from `CourierColors`** — don't introduce new hex values. Conventions used across inbox/toast:
   - Light-mode borders: `CourierColors.gray[500]` (`#E5E5E5`)
   - Dark-mode borders: `CourierColors.gray[400]` (`#3A3A3A`)
   - Backgrounds: `white[500]` (light) / `black[500]` (dark)
2. **Check contrast against the background.** A default that equals the background color renders invisible (this happened with the toast item's dark border, which was `black[500]` on a `black[500]` background). Assert in a test that the new value differs from `backgroundColor`.
3. **New theme property?** Add it to the theme type, both default themes, `mergeTheme` (nested objects need their own spread there — flat props merge automatically), and the component's `getStyles`. Existing property? Only the default values change.
4. **Public type changed?** Regenerate API reports (see the [api-reports](../api-reports/SKILL.md) skill). Value-only changes don't touch the API report.

## Verify

- **Unit test** the defaults in `src/types/__tests__/` and run the package suite (see [run-tests](../run-tests/SKILL.md)):
  ```bash
  yarn workspace @trycourier/<pkg> run test
  ```
- **Visually** via the `web-js` example app (see [run-example-app](../run-example-app/SKILL.md)) — it aliases packages to `src/`, so no rebuild is needed. Toasts/inbox items can be spawned **without auth** from the console:
  ```js
  CourierToastDatastore.shared.addMessage({ messageId: "1", title: "Hi", body: "Test" });
  ```
  Check **both modes** — set `mode="light"` / `mode="dark"` on the element (the style refresh is async; re-read computed styles after ~300ms).

## Ship

1. Add a changeset — patch for default-value tweaks, minor for new theme properties (see [changesets](../changesets/SKILL.md)).
2. Update docs: the component docs live in **mintlify-docs** (`sdk-libraries/courier-ui-inbox-web.mdx` covers inbox, toast, and preferences; theme types appear in `<Expandable>` blocks). Package READMEs between the `AUTO-GENERATED-OVERVIEW` markers are synced from mintlify-docs `sdk-libraries/readme-exports/` — never hand-edit those sections.
3. Keep default-value changes and screenshots (light + dark) in the PR description so reviewers can see the before/after.
