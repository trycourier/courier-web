<script setup lang="ts">
import { h, onMounted, type VNodeChild } from 'vue';
import {
  CourierInboxPopupMenu,
  useCourier,
  type CourierInboxMenuButtonFactoryProps,
} from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });
});

const renderMenuButton = (props: CourierInboxMenuButtonFactoryProps | null | undefined): VNodeChild => {
  const totalUnreadCount = props?.totalUnreadCount ?? 0;
  return h('button', `Open the Inbox Popup. Total unread count: ${totalUnreadCount}`);
};
</script>

<template>
  <div :style="{ padding: '24px' }">
    <CourierInboxPopupMenu :render-menu-button="renderMenuButton" />
  </div>
</template>
