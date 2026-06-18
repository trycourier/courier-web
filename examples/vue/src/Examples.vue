<script setup lang="ts">
import { RouterLink } from 'vue-router';

type ExampleCard = {
  to: string;
  title: string;
  description: string;
};

const cardStyle = {
  display: 'block',
  padding: '10px 12px',
  margin: '10px 0',
  borderRadius: '4px',
  border: '1px solid #dddddd',
  textDecoration: 'none',
  color: 'inherit',
  background: '#fafafa',
  fontSize: '13px',
} as const;

const inboxExamples: ExampleCard[] = [
  { to: '/examples/inbox', title: 'Inbox — Default', description: 'Minimal inbox with default styling and message click handling.' },
  { to: '/examples/inbox-custom-feed', title: 'Inbox — Custom Feed', description: 'Inbox configured with multiple custom feeds (All, Jobs, My Posts, Mentions).' },
  { to: '/examples/inbox-custom-tabs', title: 'Inbox — Custom Tabs', description: 'Inbox with a single feed containing multiple filtering tabs (All, Unread, Read, Important, Archived).' },
  { to: '/examples/inbox-custom-height', title: 'Inbox — Custom Height', description: 'Inbox constrained to a custom height with a tailored layout.' },
  { to: '/examples/inbox-theme', title: 'Inbox — Themed', description: 'Inbox themed via Vue with Poppins typography and accent colors.' },
  { to: '/examples/inbox-header', title: 'Inbox — Custom Header', description: 'Inbox with a fully custom header driven by feed and tab state.' },
  { to: '/examples/inbox-list-item', title: 'Inbox — Custom List Item', description: 'Inbox rendering each message as a custom list item component.' },
  { to: '/examples/inbox-actions', title: 'Inbox — Actions', description: 'Inbox with custom header action menu using Courier Vue.' },
];

const popupExamples: ExampleCard[] = [
  { to: '/examples/inbox-popup-menu', title: 'Popup — Default Menu Button', description: 'Popup inbox menu with default appearance and interactions.' },
  { to: '/examples/inbox-popup-menu-custom-feed', title: 'Popup — Custom Feed', description: 'Popup inbox menu with multiple custom feeds and tabs (All, Jobs, My Posts, Mentions, Other).' },
  { to: '/examples/inbox-popup-menu-button', title: 'Popup — Custom Menu Button', description: 'Popup inbox menu using a fully custom trigger button.' },
  { to: '/examples/inbox-popup-list-item', title: 'Popup — Custom List Item', description: 'Popup rendering messages with a custom list item component.' },
  { to: '/examples/inbox-popup-menu-theme', title: 'Popup — Themed', description: 'Popup inbox menu themed via Vue with Poppins typography and accent colors.' },
  { to: '/examples/inbox-popup-everything-else', title: 'Popup — Custom States', description: 'Popup with custom loading, empty, error, and pagination states.' },
  { to: '/examples/alignment', title: 'Popup — Alignment & Position', description: 'Demonstrates alignment and positioning options for the popup menu.' },
];

const vueOnlyExamples: ExampleCard[] = [
  { to: '/examples/element-ref', title: 'Element Ref', description: 'Access the underlying inbox element via template refs.' },
  { to: '/examples/markdown', title: 'Markdown List Item', description: 'Render inbox messages using a custom markdown list item component.' },
  { to: '/examples/hooks', title: 'Composable-only Usage', description: 'Use the Courier Vue composable directly without UI components.' },
];

const toastExamples: ExampleCard[] = [
  { to: '/examples/toast-basic', title: 'Toast — Basic', description: 'Toast notifications using the default Courier Toast theme.' },
  { to: '/examples/toast-themed', title: 'Toast — Themed', description: 'Toast notifications using a Poppins-based custom theme.' },
  { to: '/examples/toast-custom', title: 'Toast — Custom', description: 'Toast notifications rendered with a fully custom Vue component.' },
];

const preferencesExamples: ExampleCard[] = [
  { to: '/examples/preferences', title: 'Preferences — Default', description: 'Full notification preferences page with sections, toggles, and channel routing.' },
  { to: '/examples/preferences-styled', title: 'Preferences — Styled', description: 'Preferences themed with Poppins typography and a purple accent color.' },
];
</script>

<template>
  <main
    :style="{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px 16px 40px',
      boxSizing: 'border-box',
    }"
  >
    <header
      :style="{
        marginBottom: '24px',
        borderBottom: '1px solid #dddddd',
        paddingBottom: '12px',
      }"
    >
      <h1 :style="{ margin: '0 0 6px', fontSize: '22px' }">
        Courier Vue Inbox &amp; Toast Examples
      </h1>
      <p :style="{ margin: 0, fontSize: '13px', color: '#555555' }">
        Explore inbox, popup, toast, and Vue-only examples built with
        `@trycourier/courier-vue`.
      </p>
    </header>

    <section
      :style="{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }"
    >
      <!-- Inbox examples -->
      <div :style="{ flex: 1, minWidth: 0 }">
        <RouterLink v-for="card in inboxExamples" :key="card.to" :to="card.to" :style="cardStyle">
          <strong :style="{ display: 'block', fontSize: '14px', marginBottom: '6px' }">{{ card.title }}</strong>
          <span :style="{ display: 'block', color: '#666666' }">{{ card.description }}</span>
        </RouterLink>
      </div>

      <!-- Popup inbox examples -->
      <div :style="{ flex: 1, minWidth: 0 }">
        <RouterLink v-for="card in popupExamples" :key="card.to" :to="card.to" :style="cardStyle">
          <strong :style="{ display: 'block', fontSize: '14px', marginBottom: '6px' }">{{ card.title }}</strong>
          <span :style="{ display: 'block', color: '#666666' }">{{ card.description }}</span>
        </RouterLink>
      </div>

      <!-- Vue-only examples -->
      <div :style="{ flex: 1, minWidth: 0 }">
        <RouterLink v-for="card in vueOnlyExamples" :key="card.to" :to="card.to" :style="cardStyle">
          <strong :style="{ display: 'block', fontSize: '14px', marginBottom: '6px' }">{{ card.title }}</strong>
          <span :style="{ display: 'block', color: '#666666' }">{{ card.description }}</span>
        </RouterLink>
      </div>

      <!-- Toast examples -->
      <div :style="{ flex: 1, minWidth: 0 }">
        <RouterLink v-for="card in toastExamples" :key="card.to" :to="card.to" :style="cardStyle">
          <strong :style="{ display: 'block', fontSize: '14px', marginBottom: '6px' }">{{ card.title }}</strong>
          <span :style="{ display: 'block', color: '#666666' }">{{ card.description }}</span>
        </RouterLink>
      </div>

      <!-- Preferences examples -->
      <div :style="{ flex: 1, minWidth: 0 }">
        <RouterLink v-for="card in preferencesExamples" :key="card.to" :to="card.to" :style="cardStyle">
          <strong :style="{ display: 'block', fontSize: '14px', marginBottom: '6px' }">{{ card.title }}</strong>
          <span :style="{ display: 'block', color: '#666666' }">{{ card.description }}</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
