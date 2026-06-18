<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInbox, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInbox height="50vh" />
  </div>
</template>
