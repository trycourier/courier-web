<script setup lang="ts">
import { onMounted } from 'vue';
import {
  CourierInbox,
  useCourier,
  type CourierInboxListItemFactoryProps,
  type CourierInboxListItemActionFactoryProps,
} from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

const handleMessageClick = ({ message, index }: CourierInboxListItemFactoryProps) => {
  alert('Message clicked at index ' + index + ':\n' + JSON.stringify(message, null, 2));
};

const handleMessageActionClick = ({ message, action, index }: CourierInboxListItemActionFactoryProps) => {
  alert(
    'Message action clicked at index ' + index + ':\n' +
    'Action: ' + JSON.stringify(action, null, 2) + '\n' +
    'Message: ' + JSON.stringify(message, null, 2)
  );
};

const handleMessageLongPress = ({ message, index }: CourierInboxListItemFactoryProps) => {
  alert('Message long pressed at index ' + index + ':\n' + JSON.stringify(message, null, 2));
};
</script>

<template>
  <CourierInbox
    :on-message-click="handleMessageClick"
    :on-message-action-click="handleMessageActionClick"
    :on-message-long-press="handleMessageLongPress"
  />
</template>
