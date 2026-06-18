<script setup lang="ts">
import { h, onMounted, type VNodeChild } from 'vue';
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });
});

const renderListItem = (props: CourierInboxListItemFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  const { message, index } = props;
  return h(
    'pre',
    {
      style: {
        padding: '24px',
        borderBottom: '1px solid #e0e0e0',
        margin: '0',
      },
    },
    JSON.stringify({ message, index }, null, 2)
  );
};
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInboxPopupMenu :render-list-item="renderListItem" />
  </div>
</template>
