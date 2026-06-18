# @trycourier/courier-vue

Native Vue 3 components for the Courier web UI — `CourierInbox`, `CourierInboxPopupMenu`,
`CourierToast`, and `CourierPreferences`, plus the `useCourier` composable.

This package is a thin binding layer over Courier's framework-agnostic web components
(`@trycourier/courier-ui-*`). It mirrors `@trycourier/courier-react`: typed component props,
reactive state, object-based theming, and custom render slots — implemented with Vue's
reactivity and rendering model.

## Installation

```bash
npm install @trycourier/courier-vue vue
```

`vue` (>= 3.3) is a peer dependency.

## Usage

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInbox, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  // Generate a JWT for your user on your backend, then sign in.
  courier.auth.value.signIn({ userId: 'YOUR_USER_ID', jwt: 'YOUR_JWT' });
});
</script>

<template>
  <CourierInbox :height="'500px'" mode="system" />
</template>
```

### Custom render slots

Every render slot React exposes is available as a render-prop returning a Vue node. The
node is mounted into a standalone Vue app and handed to the web component, so it renders
with full Vue reactivity and event handling:

```vue
<script setup lang="ts">
import { h } from 'vue';
import { CourierInbox } from '@trycourier/courier-vue';
</script>

<template>
  <CourierInbox
    :render-list-item="(message) => h('div', { class: 'my-item' }, message?.message?.title)"
  />
</template>
```

Available render props: `renderHeader`, `renderListItem`, `renderEmptyState`,
`renderLoadingState`, `renderErrorState`, `renderPaginationItem` (and `renderMenuButton`
on `CourierInboxPopupMenu`; `renderToastItem` / `renderToastItemContent` on `CourierToast`).

### Reactive state

`useCourier()` returns the same shape as the React hook, with `auth`, `inbox`, and `toast`
as Vue `shallowRef`s that update as the underlying datastores change:

```ts
const courier = useCourier();
// courier.auth.value.userId
// courier.inbox.value.feeds / .totalUnreadCount
// courier.inbox.value.readMessage(message)
// courier.preferences.getUserPreferences()
```
