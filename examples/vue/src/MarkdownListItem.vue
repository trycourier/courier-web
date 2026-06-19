<script setup lang="ts">
import { h, onMounted, ref, watch, type VNodeChild } from 'vue';
import { CourierInbox, useCourier, type CourierInboxListItemFactoryProps } from '@trycourier/courier-vue';
import { marked } from 'marked';

const courier = useCourier();
const courierJwt = ref<string | undefined>(undefined);

const refreshCourierJwt = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 10));
  courierJwt.value = import.meta.env.VITE_JWT;
};

onMounted(() => {
  refreshCourierJwt();
});

watch(courierJwt, (jwt) => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt,
  });
});

const renderListItem = (props: CourierInboxListItemFactoryProps | null | undefined): VNodeChild => {
  const html = marked.parse(props?.message?.preview ?? '', { async: false }) as string;
  return h('div', [h('div', { innerHTML: html })]);
};
</script>

<template>
  <CourierInbox :render-list-item="renderListItem" />
</template>
