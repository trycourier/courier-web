import {
  type CourierInboxTheme,
  type CourierPreferencesTheme,
  type CourierToastTheme,
} from '@trycourier/courier-react';

/**
 * One custom look shared by the themed photo shoots: Poppins, a purple accent
 * carried by the buttons and indicators, and neutral text.
 */
export const FONT = 'Poppins';
export const ACCENT = '#8B5CF6';

const TEXT = '#1E1B2E';
const MUTED = '#6B6580';

export const inboxTheme: CourierInboxTheme = {
  inbox: {
    header: {
      feeds: {
        button: {
          font: { family: FONT, color: TEXT },
          unreadCountIndicator: { backgroundColor: ACCENT, font: { family: FONT } },
        },
        tabs: {
          default: { font: { family: FONT } },
          selected: { indicatorColor: ACCENT, font: { family: FONT, color: ACCENT } },
        },
      },
      tabs: {
        default: { font: { family: FONT } },
        selected: { indicatorColor: ACCENT, font: { family: FONT, color: ACCENT } },
      },
    },
    list: {
      scrollbar: { width: 'none' },
      item: {
        unreadIndicatorColor: ACCENT,
        title: { family: FONT, color: TEXT },
        subtitle: { family: FONT, color: MUTED },
        time: { family: FONT, color: MUTED },
        actions: {
          backgroundColor: ACCENT,
          hoverBackgroundColor: '#7C4DEF',
          activeBackgroundColor: '#6D3EE0',
          border: 'none',
          borderRadius: '8px',
          font: { family: FONT, weight: '500', color: '#FFFFFF' },
        },
      },
    },
  },
};

export const preferencesTheme: CourierPreferencesTheme = {
  primaryColor: ACCENT,
  title: { family: FONT, size: '20px', weight: '600', color: TEXT },
  subtitle: { family: FONT, size: '13px', weight: '400', color: MUTED },
  container: { font: { family: FONT, color: TEXT } },
  section: { title: { family: FONT, size: '15px', weight: '600', color: TEXT } },
  topic: {
    title: { family: FONT, size: '14px', weight: '500', color: TEXT },
    statusLabel: { family: FONT, size: '12px', weight: '400', color: '#8A82A3' },
    toggle: { trackColor: '#D9D3EC', trackActiveColor: ACCENT, thumbColor: '#FFFFFF' },
  },
  channelChip: {
    font: { family: FONT, size: '13px', weight: '400', color: MUTED },
    selectedFont: { family: FONT, size: '13px', weight: '600', color: TEXT },
    checkbox: { checkedColor: ACCENT },
  },
};

export const toastTheme: CourierToastTheme = {
  item: {
    backgroundColor: '#F5F3FF',
    border: '1px solid #DDD6FE',
    borderRadius: '14px',
    shadow: '0 8px 20px -6px rgba(45, 26, 92, 0.25)',
    title: { family: FONT, size: '15px', weight: '600', color: TEXT },
    body: { family: FONT, size: '14px', color: MUTED },
    actions: {
      backgroundColor: ACCENT,
      hoverBackgroundColor: '#7C4DEF',
      activeBackgroundColor: '#6D3EE0',
      border: 'none',
      borderRadius: '8px',
      font: { family: FONT, size: '13px', weight: '500', color: '#FFFFFF' },
    },
    // A checkmark reads as "done" beside a message asking for a decision.
    icon: { visible: false },
  },
};
