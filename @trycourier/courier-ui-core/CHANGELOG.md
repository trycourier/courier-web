# @trycourier/courier-ui-core

## 2.5.0

### Minor Changes

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Name the action theme blocks after the styles they apply to

  The blocks were named for the look — `outlined` — while a template asks for the value —
  `secondary`. Anyone theming a row of actions had to hold a mapping in their head between what
  they sent and what they styled, and `tertiary` had no name of its own at all.

  The blocks are now `button`, `secondary`, `tertiary` and `link`, one per `action.style`, so a
  theme reads the same as the template that feeds it. `link` is unchanged; `outlined` becomes
  `secondary`; `button` and `tertiary` are new, having previously been unthemable and folded into
  the top level and the outlined block respectively.

  ```diff
    actions: {
      font: { family: 'Inter' },
  -   outlined: { border: '1px solid #E5E5E5' }
  +   secondary: { border: '1px solid #E5E5E5' }
    }
  ```

  The top level still applies to every action, and an action's own Elemental styling still wins
  over both. None of these keys has shipped to npm yet, so nothing in a released version breaks.

- [#250](https://github.com/trycourier/courier-web/pull/250) [`53396e7`](https://github.com/trycourier/courier-web/commit/53396e7c0484217b6a996b8768813f9703d4f053) Thanks [@mikemilla](https://github.com/mikemilla)! - Render the button style a message action asks for, track action clicks, and render markdown previews

  Inbox and toast actions now respect the styling their template configured. `style: "secondary"`
  or `"tertiary"` draws the action's colour as an outline instead of a fill, matching how the same
  action renders in email, and `style: "link"` renders as an inline link rather than a button. A
  filled and an outlined action in the same row sit at the same height. This needed the inbox query
  to ask for `style`, which it never did — that is why every action previously rendered filled.

  Action styling is themable through a new `actions` block on the inbox and toast list item themes,
  with `outlined` and `link` sub-blocks for the two other looks. A value set on the theme outranks
  the one the action carries, so an untouched theme renders what the template configured and a set
  one overrides it. The shipped default themes therefore no longer define `actions` at all — the
  defaults come from the button, per mode, so integrators reading
  `defaultLightTheme.inbox.list.item.actions` now get `undefined`.

  Clicking an action reports the click to Courier automatically, using the tracking id the action
  carries. `markActionAsClicked(action, messageId)` is exported for custom list item renderers.

  A message's title and preview are rendered as markdown — bold, italic, strikethrough, links,
  quotes and list markers — because the inbox channel serializes its preview through markdown.
  Plain text is unaffected.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Give the outlined action a look of its own, and leave the plain button alone

  `courierActionButtonProps` returned `variant: 'secondary'` for every action that
  was not a link, so a plain action and an outlined one took the same defaults.
  That was invisible while every action arrived carrying a fill — the send pipeline
  substituted the brand's primary when a template named none — and became visible
  the moment it stopped: with no fill, the two were identical and the style an
  author picked had no effect.

  `style: 'secondary'` now resolves to a new `outlined` variant: the same face as
  the plain button, told apart by an edge you can actually see and by sitting flat
  where the plain button floats. `colors.border` could not do that job — it is the
  divider hairline, 1.26:1 against the face it would outline.

  A styleless action is unchanged: the plain button it has always rendered as,
  transparent over the row with the divider hairline for an edge. `tertiary` is
  now the solid fill in the mode's ink, the loudest of the three, for the action
  that is the thing to do on the message.

  `secondary` itself is untouched, and so is `primary`. They are public variants
  with users beyond actions, so the outline got a variant of its own rather than a
  new meaning for everyone else's button. An action that names a color of its own
  is unchanged too: it becomes the fill for `button` and `tertiary`, and the
  outline for `secondary`.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Render `tertiary` actions as a borderless button

  `tertiary` had no look of its own: `outlinedByStyle = style === 'secondary' || style === 'tertiary'`
  folded it into the outlined branch, so an author who chose it got an outlined button and no way
  to tell the two apart. Email has drawn them differently since the styles were added.

  It is now the quietest button in the row — no fill and no outline, just the label in the color
  the action carries. It keeps its padding and a transparent border, so it still reads as a button
  and still lines up with a filled or outlined sibling beside it.

  `CourierButtonVariants.tertiary` is what defines that look now. It previously described a
  gray-filled button and nothing ever selected it, so the kit's variant vocabulary and Elemental's
  style vocabulary now agree on what `tertiary` means. Its hover and active states are a wash
  behind the label rather than the usual brightness step — there is no fill to darken, the same
  reason a link needs one.

  This changes what a `tertiary` action looks like. Anything relying on it rendering as outlined
  should ask for `secondary`, which is what it was actually getting.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Line the button variants up with the styles that ask for them

  `CourierButtonVariants` and Elemental's `action.style` described the same looks in
  two vocabularies that crossed over: `style: 'button'` resolved to
  `variant: 'secondary'`, and `style: 'tertiary'` to `variant: 'primary'`. Every
  reader had to carry the mapping, and the theme blocks — already named for the
  styles — read as though they pointed somewhere else.

  The mapping is now the obvious one:

  | `action.style` | variant     |
  | -------------- | ----------- |
  | `button`       | `primary`   |
  | `secondary`    | `secondary` |
  | `tertiary`     | `tertiary`  |
  | `link`         | `link`      |

  `primary` is the default an action renders as when it names no style, which is why
  it is also `CourierButton`'s default variant.

  **No look changed.** Verified against the template designer's built stylesheet:
  all four styles, both modes, base and hover and active, zero differences.

  `outlined` is gone, having existed only for the length of this branch. What it
  drew is now `secondary`.

### Patch Changes

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix three ways a message action rendered wrong once it stopped carrying color

  All three were masked while every action arrived with a fill substituted by the send pipeline.
  With the action reduced to its style, the defaults underneath it are the whole appearance, and
  they were not right.

  **An action ignored a system theme flip.** Everything else in the inbox re-reads its theme
  through the theme manager's subscription. `CourierButton` styles itself once, in its
  constructor, resolving `mode: 'system'` against the theme in force at that moment — and
  `themeManager.mode` is the _user's_ setting, which is `'system'` unless an integrator pinned
  it. It never overrode `onSystemThemeChange`, so an OS flip left the actions, and only the
  actions, wearing the mode that had just ended: a near-black filled button on a dark list, or a
  white outlined one. It now restyles on the flip, and a button pinned to `light` or `dark` still
  ignores the OS.

  **An outlined action had no visible outline.** Its border was `colors.border` — the hairline
  rows are separated with — which is about 1.3:1 against the surface the same button is filled
  with, in either mode. An outlined action was indistinguishable from a borderless one unless the
  template gave it a color, which templates no longer do. It now uses `gray[600]`, which clears
  3:1 against both faces, so one value serves light and dark. `colors.border` itself is unchanged,
  so dividers are unaffected.

  **A link sat too high beside a taller action.** Not a defect in the rendered inbox — a native
  button centers its own content — but the row stretches its actions so their borders line up, so
  anything drawn as a `div` rather than a `button` has to say it centers. Noted here because the
  theme contract now depends on it.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Render the template designer's outlined action as a button rather than a link

  The designer has no way to say "outlined" — the content API accepts only `button` and `link` —
  so it encodes an outlined inbox button as `style: "link"` carrying a white background, and reads
  that pair back as outlined. Taking the style at face value showed an underlined phrase where the
  author had configured a button. That pair now renders as the outlined look, on the kit's own
  mode-aware defaults. A link written by hand is unaffected: it arrives carrying a real colour,
  since the send pipeline substitutes the brand's primary when a template names none.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Pitch the outlined action's edge to the mode it is drawn in

  One gray cannot read the same on both faces. `gray[600]` is a quiet edge on white at 4.7:1, but
  against `black[500]` the same value is 3.8:1 and reads louder than the button it belongs to. Dark
  mode steps down to a new `gray[650]` (`#585858`, 2.5:1) — softer than the edge it replaces,
  and still well clear of the ~1.3:1 divider hairline that made an outlined action look borderless.

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Ignore a brand token that never resolved, rather than painting with it

  The send pipeline fills an action's `background_color` with
  `{brand.colors.primary}` whenever the template names no color of its own, and
  that token becomes a color only if a brand is configured and resolves. When it
  does not, the literal string reaches the kit.

  Being neither empty nor a color, it read as an accent the author had chosen.
  `secondary` built `1px solid {brand.colors.primary}` from it, the browser
  dropped the declaration as invalid, and an outlined action rendered with no
  outline and no label color — an unstyled ghost where an outlined button belonged.

  An unresolved token is the absence of a color, so it is treated as one and the
  look falls back to the kit's own defaults. A color a template actually named is
  unaffected.

## 2.4.0

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

## 2.3.1

### Patch Changes

- [#244](https://github.com/trycourier/courier-web/pull/244) [`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e) Thanks [@mikemilla](https://github.com/mikemilla)! - Version bump only, so every package moves to a version the registry has not seen. No functional change.

  These three sat at versions already on npm while the rest of the packages released, and `changeset publish` attempts every package on each run — the already-published ones come back rejected and take the whole Release run down with them.

## 2.3.0

### Minor Changes

- [#215](https://github.com/trycourier/courier-web/pull/215) [`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f) Thanks [@mikemilla](https://github.com/mikemilla)! - Toast items now render a visible subtle border in dark mode (the previous default matched the background color, so no border appeared), and the dark-mode hover/active backgrounds are softer, matching the inbox list item's effective hover colors. Adds opaque dark-surface shades `gray[700]`/`gray[800]` to `CourierColors`.

## 2.2.1

### Patch Changes

- [#196](https://github.com/trycourier/courier-web/pull/196) [`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979) Thanks [@mikemilla](https://github.com/mikemilla)! - Scope all injected global CSS selectors to their component tags so they can no longer leak into and clobber host-app styles (C-18926).

  - **courier-ui-core**: the inbox empty/error state (`CourierInfoState`) was injecting a bare, global `.container` rule into the page; now scoped to `courier-info-state`. Also scoped the `.courier-checkbox*` and `.courier-radio*` selectors.
  - **courier-ui-toast**: renamed the generic global keyframes `show` / `hide` / `auto-dismiss` to `courier-toast-*` so they can't collide with a host app's `@keyframes`.
  - **courier-ui-preferences**: scoped all `.courier-*` class selectors (preferences root, section, topic, toggle, channel-routing, digest-schedule) to their component tags.

## 2.2.0

### Minor Changes

- Add Courier preferences support and align package documentation.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.
  - All published packages: add READMEs that follow the shared SDK flow and set the npm `homepage` to courier.com.

## 2.1.0

### Minor Changes

- [#178](https://github.com/trycourier/courier-web/pull/178) [`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576) Thanks [@mikemilla](https://github.com/mikemilla)! - Add Courier preferences support.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.

## 2.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Minor Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Add support for a user-defined feeds and tabs in the Inbox. Tabs can be filtered by archived and read status, and a set of tags.

## 1.0.14

### Patch Changes

- [#110](https://github.com/trycourier/courier-web/pull/110) [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6) Thanks [@danasilver](https://github.com/danasilver)! - Reorganize theme management to improve maintainability.
