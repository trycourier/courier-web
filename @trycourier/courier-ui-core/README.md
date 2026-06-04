<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier UI Core

`@trycourier/courier-ui-core` is the shared core UI kit for Courier's browser SDKs. It provides the low-level Web Components, theming utilities, and color helpers that power [Courier Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox), [Courier Toast](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast), and [Courier Preferences](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-preferences).

> **Building a notification experience?** You probably want one of the higher-level packages — [Courier UI Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox), [Courier UI Toast](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast), or [Courier UI Preferences](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-preferences) — which depend on this package. Install `courier-ui-core` directly only when building custom Courier UI.

## Installation

```bash
npm install @trycourier/courier-ui-core
```

Works with any JavaScript build system; no additional build configuration required.

## Quick Start

```ts
import {
  CourierButton,
  CourierIcon,
  CourierInfoState,
  CourierThemeManager,
} from "@trycourier/courier-ui-core";

// Core elements (e.g. <courier-button>, <courier-icon>, <courier-checkbox>,
// <courier-radio>) register themselves on import and can be used directly.
```

## Features

- **Core Elements** — `<courier-button>`, `<courier-icon>`, `<courier-icon-button>`, `<courier-link>`, `<courier-info-state>`, `<courier-checkbox>`, `<courier-radio>`
- **Theming** — `CourierThemeManager` plus light/dark/system theme-mode utilities shared across all Courier UI packages
- **Color Utilities** — the Courier color palette and helpers used to build consistent themes
- **Base Classes** — `CourierBaseElement` and registration helpers for building custom Courier Web Components

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries](https://www.courier.com/docs/sdk-libraries/)**

- [Inbox Web Components](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web/)
- [Toast Web Components](https://www.courier.com/docs/sdk-libraries/courier-ui-toast-web/)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
