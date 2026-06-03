'use client'

import { useEffect } from 'react'
import { CourierPreferences, useCourier, type CourierPreferencesTheme } from '@trycourier/courier-react'

const FONT = 'Poppins';
const ACCENT = '#8B5CF6';

const lightTheme: CourierPreferencesTheme = {
  primaryColor: ACCENT,
  container: { font: { family: FONT, color: '#1E1B2E' } },
  loading: { font: { family: FONT, size: '14px', weight: '400', color: '#6B6580' } },
  error: { font: { family: FONT, size: '14px', weight: '400', color: '#DC2626' } },
  section: { title: { family: FONT, size: '18px', weight: '600', color: '#1E1B2E' } },
  topic: {
    title: { family: FONT, size: '16px', weight: '500', color: '#1E1B2E' },
    statusLabel: { family: FONT, size: '13px', weight: '400', color: '#8A82A3' },
    toggle: { trackColor: '#D9D3EC', trackActiveColor: ACCENT, thumbColor: '#FFFFFF', borderRadius: '12px' },
  },
  digest: {
    font: { family: FONT, size: '14px', weight: '400', color: '#6B6580' },
    selectedFont: { family: FONT, size: '14px', weight: '600', color: '#1E1B2E' },
    iconColor: ACCENT,
    radio: { ringColor: '#D9D3EC', checkedColor: ACCENT },
  },
  channelChip: {
    font: { family: FONT, size: '14px', weight: '400', color: '#6B6580' },
    selectedFont: { family: FONT, size: '14px', weight: '600', color: '#1E1B2E' },
    divider: '1px solid #ECE8F7',
    checkbox: { checkedColor: ACCENT },
  },
};

const darkTheme: CourierPreferencesTheme = {
  primaryColor: ACCENT,
  container: { font: { family: FONT, color: '#F5F3FB' } },
  loading: { font: { family: FONT, size: '14px', weight: '400', color: '#A39FB8' } },
  error: { font: { family: FONT, size: '14px', weight: '400', color: '#F87171' } },
  section: { title: { family: FONT, size: '18px', weight: '600', color: '#F5F3FB' } },
  topic: {
    title: { family: FONT, size: '16px', weight: '500', color: '#F5F3FB' },
    statusLabel: { family: FONT, size: '13px', weight: '400', color: '#A39FB8' },
    toggle: { trackColor: '#3A3552', trackActiveColor: ACCENT, thumbColor: '#FFFFFF', borderRadius: '12px' },
  },
  digest: {
    font: { family: FONT, size: '14px', weight: '400', color: '#A39FB8' },
    selectedFont: { family: FONT, size: '14px', weight: '600', color: '#F5F3FB' },
    iconColor: '#B79CFF',
    radio: { ringColor: '#3A3552', checkedColor: '#B79CFF' },
  },
  channelChip: {
    font: { family: FONT, size: '14px', weight: '400', color: '#A39FB8' },
    selectedFont: { family: FONT, size: '14px', weight: '600', color: '#F5F3FB' },
    divider: '1px solid #2E2A40',
    checkbox: { checkedColor: '#B79CFF' },
  },
};

export default function PreferencesStyled() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: process.env.NEXT_PUBLIC_JWT!,
    });
  }, []);

  return (
    <div
      style={{
        margin: 0,
        minHeight: '100vh',
        background: '#F4F1FB',
      }}
    >
      <div style={{ padding: '40px 16px' }}>
        <CourierPreferences lightTheme={lightTheme} darkTheme={darkTheme} mode="light" />
      </div>
    </div>
  );
}
