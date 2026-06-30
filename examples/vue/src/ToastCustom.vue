<script setup lang="ts">
import { h, onMounted, type VNodeChild } from 'vue';
import {
  CourierToast,
  useCourier,
  type CourierToastItemFactoryProps,
} from '@trycourier/courier-vue';

const courier = useCourier();

onMounted(() => {
  // Authenticate with the Courier backend
  courier.shared.signIn({
    userId: import.meta.env.VITE_USER_ID,
    jwt: import.meta.env.VITE_JWT,
  });
});

const showToast = () => {
  courier.toast.value.addMessage({
    messageId: 'custom-1',
    title: '📸 New photos from Fred L.',
    body: 'Fred shared 4 photos.',
    actions: [{ content: 'See more' }, { content: 'Mark read' }],
  });
};

// Render a custom component for each toast item
const renderToastItem = (props: CourierToastItemFactoryProps): VNodeChild => {
  const { message } = props;
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      },
    },
    [
      h(
        'div',
        {
          style: {
            flex: 1,
            padding: '16px',
            background: '#f6f6fe',
            border: '1px solid #c6c2ff',
            borderRadius: '8px',
          },
        },
        [
          h('strong', { style: { display: 'block', marginBottom: '4px' } }, message.title),
          h('p', { style: { margin: 0, fontSize: '14px' } }, message.body),
        ]
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '100px',
          },
        },
        (message.actions ?? []).map((action, index) =>
          h(
            'button',
            {
              key: index,
              onClick: () => window.open(action.href),
              style: {
                padding: '8px 12px',
                background: '#f6f6fe',
                border: '1px solid #c6c2ff',
                borderRadius: '8px',
              },
            },
            action.content
          )
        )
      ),
    ]
  );
};
</script>

<template>
  <div
    :style="{
      margin: 0,
      minHeight: '100vh',
      padding: '40px',
      boxSizing: 'border-box',
      background: 'white',
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`,
    }"
  >
    <button type="button" @click="showToast">Show custom toast</button>
    <CourierToast :render-toast-item="renderToastItem" />
  </div>
</template>
