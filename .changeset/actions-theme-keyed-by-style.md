---
"@trycourier/courier-ui-core": minor
"@trycourier/courier-ui-inbox": minor
"@trycourier/courier-ui-toast": minor
---

Name the action theme blocks after the styles they apply to

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
