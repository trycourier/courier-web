'use client';

import { CourierPreferences, type CourierPreferencesTheme } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierPreferencesTabProps {
  lightTheme?: CourierPreferencesTheme;
  darkTheme?: CourierPreferencesTheme;
  colorMode: ColorMode;
}

export function CourierPreferencesTab({ lightTheme, darkTheme, colorMode }: CourierPreferencesTabProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <CourierPreferences
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        mode={colorMode}
      />
    </div>
  );
}
