# Agent instructions (courier-web)

**This repository is public.** Everything committed here — code, comments, docs,
skills, commit messages — is world-readable. Keep internal-only material (other
Courier repos and their layout, deploy/hosting setup, dashboards, ticket numbers,
customer names, credentials) out of it. Notes about how another repo consumes these
packages belong in that repo, not here.

## Layout

| Path | What |
| --- | --- |
| `@trycourier/*` | The published packages (`courier-js`, `courier-ui-core`, `courier-ui-inbox`, `courier-ui-toast`, `courier-ui-preferences`, `courier-react`, `courier-react-17`, `courier-react-components`, `courier-vue`, `courier-angular`) |
| `examples/*` | Runnable example apps (`web-js`, `vue`, `angular`, `react-latest`, `react-17`, `next-latest`, `next-12`) |
| `designer/` | Internal theming/designer app |
| `api/*.api.md` | Committed API Extractor reports — CI fails if these drift |
| `.agents/skills/` | Task-specific instructions (`.claude/skills` is a symlink to it) |

Packages depend on each other through their **built `dist/`**, not their source, so
a source edit isn't visible to tests or examples until you rebuild.

## Commands

```bash
yarn install
yarn build-packages          # build all packages (needed before tests/examples resolve)
yarn sync                    # clean reinstall + rebuild, when things look stale
yarn test:all                # every package's suite
yarn workspace @trycourier/<pkg> run test
yarn workspace <example> run dev
yarn generate-api-docs       # refresh api/*.api.md after an intentional API change
yarn build-packages:ci       # what CI runs: build + API report check
```

## Skills

Read the matching skill in `.agents/skills/` before starting; each one documents the
places a change of that kind has to touch.

| Skill | Use for |
| --- | --- |
| `sync-packages` | `Cannot find module '@trycourier/...'`, stale `dist/` |
| `run-tests` | Running a package suite or reproducing a CI test failure |
| `api-reports` | CI failing on an API diff, or refreshing a report after an API change |
| `changesets` | Version bumps for a release |
| `npm-release-pipeline` | Release run failures, missing changelogs, publish problems |
| `run-example-app` | Running an example to check a change in a browser |
| `add-example-app` | Registering a brand-new example app |
| `sync-examples` | Keeping the react/vue/angular showcases at feature parity |
| `update-component-theme` | Changing or adding a themable style |

## Conventions

- Match the surrounding code's style, naming, and comment density. Comments explain
  *why*, not *what*.
- A behavior change to a component needs both: a test where the behavior can be
  expressed, and a check in a real browser via an example app — jsdom has no
  hit-testing, no `:hover`, no layout, and no CSS animations, so hover, stacking,
  and timer bugs are invisible to it. If no example exercises the feature (several
  options default to off), add one as part of the change.
- Public API changes must ship with the regenerated `api/*.api.md` in the same PR.
