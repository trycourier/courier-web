<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierToast, useCourier, type CourierToastTheme } from '@trycourier/courier-vue';
import ToastIcon from './toast-icon.svg?raw';

const themedToast: CourierToastTheme = {
  item: {
    title: {
      color: '#6366f1',
      weight: '600',
      family: 'Poppins',
      size: '15px',
    },
    body: {
      family: 'Poppins',
      size: '14px',
    },
    actions: {
      font: {
        family: 'Poppins',
        size: '13px',
        weight: '500',
      },
    },
    backgroundColor: '#edeefc',
    border: '1px solid #cdd1ff',
    borderRadius: '15px',
    icon: {
      svg: ToastIcon,
    },
  },
};

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

const showToast = () => {
  courier.toast.value.addMessage({
    messageId: 'themed-1',
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
      fontFamily: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
    }"
  >
    <button type="button" @click="showToast">Show themed toast</button>
    <CourierToast :light-theme="themedToast" />
  </div>
</template>
