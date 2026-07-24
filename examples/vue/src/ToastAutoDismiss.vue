<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierToast, useCourier } from '@trycourier/courier-vue';

const AUTO_DISMISS_TIMEOUT_MS = 6000;

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

// Toasts are matched to messages by id, so each one needs a distinct id.
let count = 0;

const showToast = () => {
  count += 1;
  courier.toast.value.addMessage({
    messageId: `auto-dismiss-${count}`,
    title: `📸 New photos from Fred L. (${count})`,
    body: 'Fred shared 4 photos.',
    actions: [{ content: 'See more' }, { content: 'Mark read' }],
  });
};

const showToastStack = () => {
  showToast();
  showToast();
  showToast();
};
</script>

<template>
  <div
    :style="{
      margin: 0,
      minHeight: '100vh',
      padding: '40px',
      boxSizing: 'border-box',
      background: 'white',
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
    }"
  >
    <h1 :style="{ margin: '0 0 6px', fontSize: '22px' }">Toast — Auto-dismiss timer</h1>
    <p :style="{ margin: '0 0 20px', fontSize: '13px', color: '#555555', maxWidth: '560px' }">
      Each toast dismisses itself after {{ AUTO_DISMISS_TIMEOUT_MS / 1000 }} seconds, counted
      down by the timer bar across the top of the toast. Hover the toast to freeze the
      countdown — every toast in the stack pauses, and they all resume from where they left
      off once the cursor leaves.
    </p>

    <div :style="{ display: 'flex', gap: '8px' }">
      <button type="button" @click="showToast">Show timed toast</button>
      <button type="button" @click="showToastStack">Show 3 timed toasts</button>
    </div>

    <CourierToast auto-dismiss :auto-dismiss-timeout-ms="AUTO_DISMISS_TIMEOUT_MS" />
  </div>
</template>
