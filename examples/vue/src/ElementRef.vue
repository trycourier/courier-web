<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CourierInbox, useCourier, type CourierInboxElement } from '@trycourier/courier-vue';

const courier = useCourier();
const inboxComp = ref<{ getElement: () => CourierInboxElement | null } | null>(null);

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });

  // Access the underlying inbox web component element via the exposed getElement().
  inboxComp.value?.getElement()?.removeHeader();
});
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInbox ref="inboxComp" />
  </div>
</template>
