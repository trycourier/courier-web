<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Courier } from '@trycourier/courier-ui-inbox';

// A ref to the <courier-inbox> custom element so we can call its imperative API.
const inbox = ref<HTMLElement & {
  onMessageClick: (cb: (props: { message: unknown; index: number }) => void) => void;
} | null>(null);

onMounted(() => {
  const userId = import.meta.env.VITE_USER_ID as string | undefined;
  const jwt = import.meta.env.VITE_JWT as string | undefined;

  // Sign in if credentials are provided. Without them the inbox renders its
  // signed-out / empty state — which is exactly the UI that used to inject a
  // global `.container` style and break this page's layout.
  if (userId && jwt) {
    Courier.shared.signIn({ userId, jwt });
  }

  inbox.value?.onMessageClick(({ message, index }) => {
    alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
  });
});
</script>

<template>
  <!-- `.container` is THIS app's layout class. If the inbox leaks a global
       `.container` rule, this grid collapses and the page breaks. -->
  <div class="container">
    <header class="page-header">
      <h1>My Vue App</h1>
      <p>Courier Inbox embedded via Web Components</p>
    </header>

    <div class="callout">
      This page's layout is driven by a generic <code>.container</code> class.
      The Courier inbox empty-state used to inject a global
      <code>.container</code> rule into <code>&lt;head&gt;</code> that hijacked
      it and collapsed the layout. If the header, sidebar and footer below stay
      laid out correctly while the inbox shows its empty / signed-out state, the
      fix is working.
    </div>

    <main class="content">
      <aside class="sidebar">
        <strong>Navigation</strong>
        <ul>
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Settings</li>
        </ul>
      </aside>

      <section class="inbox-card">
        <courier-inbox ref="inbox"></courier-inbox>
      </section>
    </main>

    <footer class="page-footer">
      &copy; My Vue App — layout should be unaffected by the inbox.
    </footer>
  </div>
</template>
