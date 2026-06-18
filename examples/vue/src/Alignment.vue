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
  <div :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }">
    <!-- popupAlignment: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center' -->
    <CourierInboxPopupMenu
      popup-alignment="top-right"
      popup-width="340px"
      popup-height="400px"
      top="44px"
      right="44px"
    />
  </div>
</template>
