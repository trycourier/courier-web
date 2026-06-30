<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierPreferences, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});
</script>

<template>
  <div
    :style="{
      margin: 0,
      minHeight: '100vh',
      background: '#F5F5F5',
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
    }"
  >
    <div :style="{ padding: '40px 16px' }">
      <CourierPreferences />
    </div>
  </div>
</template>
