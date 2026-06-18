<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  useCourier,
  type CourierUserPreferencesTopic,
  defaultFeeds,
} from '@trycourier/courier-vue';

const { auth, inbox, preferences } = useCourier();
const topics = ref<CourierUserPreferencesTopic[]>([]);

onMounted(() => {
  // Authenticate the user
  auth.value.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
    showLogs: false,
  });

  // Load the inbox
  loadInbox();

  // Load preferences
  loadPreferences();
});

async function loadInbox() {
  inbox.value.registerFeeds(defaultFeeds());

  // Set up socket listener for real-time updates
  await inbox.value.listenForUpdates();

  // Load the initial inbox data
  await inbox.value.load();

  // Fetch the next page of messages if possible
  await fetchNextPageOfMessages();
}

async function fetchNextPageOfMessages() {
  const nextPage = await inbox.value.fetchNextPageOfMessages({ datasetId: 'all_messages' });
  if (nextPage && nextPage.canPaginate) {
    await fetchNextPageOfMessages();
  }
}

async function loadPreferences() {
  const prefs = await preferences.getUserPreferences();
  topics.value = prefs.items;
}
</script>

<template>
  <div>
    <div :style="{ padding: '24px' }">Total Unread Count: {{ inbox.totalUnreadCount }}</div>
    <ul>
      <li
        v-for="message in inbox.feeds['all_messages']?.messages ?? []"
        :key="message.messageId"
        :style="{ backgroundColor: message.read ? 'transparent' : 'red' }"
      >
        {{ message.title }}
      </li>
    </ul>
    <h3>User Preferences</h3>
    <ul>
      <li v-for="topic in topics" :key="topic.topicId">{{ topic.topicName }} — {{ topic.status }}</li>
    </ul>
  </div>
</template>
