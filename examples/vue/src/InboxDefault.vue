<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInbox, useCourier } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    apiUrls: {
      courier: {
        rest: import.meta.env.VITE_COURIER_REST_URL,
        graphql: import.meta.env.VITE_COURIER_GRAPHQL_URL,
      },
      inbox: {
        graphql: import.meta.env.VITE_INBOX_GRAPHQL_URL,
        webSocket: import.meta.env.VITE_INBOX_WEBSOCKET_URL,
      },
    },
  });
});
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInbox />
  </div>
</template>
