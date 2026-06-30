<script setup lang="ts">
import { onMounted } from 'vue';
import { CourierInbox, useCourier, type CourierInboxFeed } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

// Single feed with multiple tabs for filtering
const feeds: CourierInboxFeed[] = [
  {
    feedId: 'notifications',
    title: 'Notifications',
    tabs: [
      { datasetId: 'all-notifications', title: 'All', filter: {} },
      { datasetId: 'unread-notifications', title: 'Unread', filter: { status: 'unread' } },
      { datasetId: 'read-notifications', title: 'Read', filter: { status: 'read' } },
      { datasetId: 'important', title: 'Important', filter: { tags: ['important'] } },
      { datasetId: 'archived', title: 'Archived', filter: { archived: true } },
    ],
  },
];
</script>

<template>
  <CourierInbox :feeds="feeds" />
</template>
