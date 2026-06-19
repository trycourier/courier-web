<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInbox, useCourier } from '@trycourier/courier-vue';

// Grab the shared Courier instance provided by the SDK.
const courier = useCourier();

onMounted(() => {
  // Sign the user in so the inbox can load their messages. Without valid
  // credentials the inbox renders its empty / signed-out state.
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});
</script>

<template>
  <CourierInbox />
</template>
