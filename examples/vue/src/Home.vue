<script setup lang="ts">
import { onMounted } from 'vue';
import { useCourier, CourierInbox, type CourierInboxListItemFactoryProps } from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

const handleMessageClick = (props: CourierInboxListItemFactoryProps) => {
  alert(JSON.stringify(props, null, 2));
};
</script>

<template>
  <div :style="{ padding: '24px' }">
    <div :style="{ marginBottom: '24px' }">
      <router-link to="/examples" :style="{ color: '#0066cc', textDecoration: 'underline' }">
        View All Examples →
      </router-link>
    </div>
    <CourierInbox :on-message-click="handleMessageClick" />
  </div>
</template>
