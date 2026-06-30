<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierToast, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

const showToast = () => {
  courier.toast.value.addMessage({
    messageId: 'basic-1',
    title: '📸 New photos from Fred L.',
    body: 'Fred shared 4 photos.',
    actions: [{ content: 'See more' }, { content: 'Mark read' }],
  });
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
    <button type="button" @click="showToast">Show basic toast</button>
    <CourierToast />
  </div>
</template>
