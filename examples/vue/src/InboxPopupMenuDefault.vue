<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInboxPopupMenu, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });
});
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInboxPopupMenu />
  </div>
</template>
