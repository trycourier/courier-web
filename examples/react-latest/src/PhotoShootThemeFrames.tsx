import { useMemo } from 'react';
import {
  CourierInbox,
  CourierPreferences,
  type CourierInboxTheme,
  type CourierPreferencesTheme,
} from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import { createPreviewPreferences } from './previewPreferences';

const FONT = 'Poppins';
const ACCENT = '#8B5CF6';
const DARK_ACCENT = '#B79CFF';
const DARK_SURFACE = '#171717';

/**
 * A component's styles are injected once per document, so two instances in the
 * same page cannot hold different themes — the last one to render wins. These
 * frames each get their own document (loaded in an iframe by the light/dark
 * photo shoots) so the two modes can sit side by side.
 */
function frameStyle(background: string) {
  return {
    margin: 0,
    height: '100vh',
    boxSizing: 'border-box' as const,
    backgroundColor: background,
    overflow: 'hidden',
  };
}

function inboxTheme(mode: 'light' | 'dark'): CourierInboxTheme {
  const accent = mode === 'light' ? ACCENT : DARK_ACCENT;
  const titleColor = mode === 'light' ? '#1E1B2E' : '#F5F3FB';
  const subtitleColor = mode === 'light' ? '#6B6580' : '#A39FB8';

  return {
    inbox: {
      header: {
        feeds: {
          button: {
            font: { family: FONT, color: titleColor },
            unreadCountIndicator: { backgroundColor: accent, font: { family: FONT } },
          },
          tabs: {
            default: { font: { family: FONT } },
            selected: { indicatorColor: accent, font: { family: FONT, color: accent } },
          },
        },
        tabs: {
          default: { font: { family: FONT } },
          selected: { indicatorColor: accent, font: { family: FONT, color: accent } },
        },
      },
      list: {
        scrollbar: { width: 'none' },
        item: {
          unreadIndicatorColor: accent,
          title: { family: FONT, color: titleColor },
          subtitle: { family: FONT, color: subtitleColor },
          time: { family: FONT, color: subtitleColor },
          // Filled accent buttons, rounded enough to read as branded without
          // turning into pills at this size.
          actions: {
            backgroundColor: accent,
            hoverBackgroundColor: mode === 'light' ? '#7C4DEF' : '#C7B2FF',
            activeBackgroundColor: mode === 'light' ? '#6D3EE0' : '#D3C4FF',
            border: 'none',
            borderRadius: '8px',
            font: { family: FONT, weight: '500', color: mode === 'light' ? '#FFFFFF' : '#1E1B2E' },
          },
        },
      },
    },
  };
}

/** One half of the "custom theme" inbox shoot. */
export function InboxThemeFrame({ mode }: { mode: 'light' | 'dark' }) {
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);
  const theme = useMemo(() => inboxTheme(mode), [mode]);

  return (
    <div style={frameStyle(mode === 'light' ? '#FFFFFF' : DARK_SURFACE)}>
      <CourierInbox
        mode={mode}
        height="100%"
        lightTheme={mode === 'light' ? theme : undefined}
        darkTheme={mode === 'dark' ? theme : undefined}
        previewMessages={previewMessages}
      />
    </div>
  );
}

function preferencesTheme(mode: 'light' | 'dark'): CourierPreferencesTheme {
  const accent = mode === 'light' ? ACCENT : DARK_ACCENT;
  const titleColor = mode === 'light' ? '#1E1B2E' : '#F5F3FB';
  const mutedColor = mode === 'light' ? '#6B6580' : '#A39FB8';

  return {
    primaryColor: accent,
    title: { family: FONT, size: '20px', weight: '600', color: titleColor },
    subtitle: { family: FONT, size: '13px', weight: '400', color: mutedColor },
    container: { font: { family: FONT, color: titleColor } },
    section: { title: { family: FONT, size: '15px', weight: '600', color: titleColor } },
    topic: {
      title: { family: FONT, size: '14px', weight: '500', color: titleColor },
      statusLabel: { family: FONT, size: '12px', weight: '400', color: mutedColor },
      toggle: {
        trackColor: mode === 'light' ? '#D9D3EC' : '#3A3552',
        trackActiveColor: accent,
        thumbColor: '#FFFFFF',
      },
    },
    channelChip: {
      font: { family: FONT, size: '13px', weight: '400', color: mutedColor },
      selectedFont: { family: FONT, size: '13px', weight: '600', color: titleColor },
      checkbox: { checkedColor: accent },
    },
  };
}

/** One half of the "custom theme" preferences shoot. */
export function PreferencesThemeFrame({ mode }: { mode: 'light' | 'dark' }) {
  const previewData = useMemo(() => createPreviewPreferences(), []);
  const theme = useMemo(() => preferencesTheme(mode), [mode]);

  return (
    <div
      style={{
        ...frameStyle(mode === 'light' ? '#F4F1FB' : DARK_SURFACE),
        padding: '20px',
      }}
    >
      <CourierPreferences
        mode={mode}
        lightTheme={mode === 'light' ? theme : undefined}
        darkTheme={mode === 'dark' ? theme : undefined}
        previewData={previewData}
      />
    </div>
  );
}
