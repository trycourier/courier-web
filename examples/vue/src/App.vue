<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Courier } from '@trycourier/courier-ui-inbox';

// A ref to the <courier-inbox> custom element so we can call its imperative API.
const inbox = ref<HTMLElement & {
  onMessageClick: (cb: (props: { message: unknown; index: number }) => void) => void;
} | null>(null);

onMounted(() => {
  Courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });

  inbox.value?.onMessageClick(({ message, index }) => {
    alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
  });
});
</script>

<template>
  <courier-inbox ref="inbox"></courier-inbox>
</template>
