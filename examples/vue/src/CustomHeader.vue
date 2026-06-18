<script setup lang="ts">
import { h, onMounted, ref, type VNodeChild } from 'vue';
import {
  CourierInbox,
  useCourier,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxFeed,
  type CourierInboxElement,
} from '@trycourier/courier-vue';

const courier = useCourier();
const inboxComp = ref<{ getElement: () => CourierInboxElement | null } | null>(null);

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });

  const el = inboxComp.value?.getElement();
  if (el) {
    // Remove the header
    el.removeHeader();

    // Select the feed and tab
    el.selectFeed('archive');
    el.selectTab('archive_2');
  }
});

const feeds: CourierInboxFeed[] = [
  {
    feedId: 'inbox',
    title: 'Inbox',
    tabs: [{ datasetId: 'inbox', title: 'Inbox', filter: {} }],
  },
  {
    feedId: 'archive',
    title: 'Archive',
    tabs: [
      { datasetId: 'archive_1', title: 'Archive 1', filter: { archived: true } },
      { datasetId: 'archive_2', title: 'Archive 2', filter: { archived: true } },
    ],
  },
];

const renderHeader = (props: CourierInboxHeaderFactoryProps | null | undefined): VNodeChild => {
  if (!props) return null;
  const selectedFeed = props.feeds.find((feed) => feed.isSelected);
  const selectedTab = selectedFeed?.tabs.find((tab) => tab.isSelected);

  return h(
    'div',
    {
      onClick: () => alert(JSON.stringify(props, null, 2)),
      style: {
        background: 'red',
        fontSize: '24px',
        padding: '24px',
        width: '100%',
      },
    },
    `${selectedFeed?.feedId ?? ''} - ${selectedTab?.datasetId ?? ''} - ${selectedTab?.unreadCount ?? 0}`
  );
};
</script>

<template>
  <CourierInbox ref="inboxComp" :feeds="feeds" :render-header="renderHeader" />
</template>
