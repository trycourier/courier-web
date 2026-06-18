<script setup lang="ts">
import { h, onMounted, type VNodeChild } from 'vue';
import {
  CourierInbox,
  useCourier,
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxPaginationItemFactoryProps,
} from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });
});

const renderLoadingState = (props: CourierInboxStateLoadingFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  return h(
    'div',
    {
      style: {
        width: '100%',
        padding: '24px',
        background: 'red',
        textAlign: 'center',
      },
    },
    'Custom Loading State'
  );
};

const renderEmptyState = (props: CourierInboxStateEmptyFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  return h(
    'div',
    {
      style: {
        width: '100%',
        padding: '24px',
        background: 'green',
        textAlign: 'center',
      },
    },
    'Custom Empty State'
  );
};

const renderErrorState = (props: CourierInboxStateErrorFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  return h(
    'div',
    {
      style: {
        width: '100%',
        padding: '24px',
        background: 'blue',
        textAlign: 'center',
      },
    },
    `Custom Error State: ${props.error.message}`
  );
};

const renderPaginationItem = (props: CourierInboxPaginationItemFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  return h(
    'div',
    {
      style: {
        padding: '24px',
        background: 'yellow',
        textAlign: 'center',
      },
    },
    'Custom Pagination Item'
  );
};
</script>

<template>
  <CourierInbox
    :render-loading-state="renderLoadingState"
    :render-empty-state="renderEmptyState"
    :render-error-state="renderErrorState"
    :render-pagination-item="renderPaginationItem"
  />
</template>
