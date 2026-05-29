'use client';

import { CourierPreferences } from '@trycourier/courier-react';
import type { CourierPreferencesTheme } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierPreferencesTabProps {
  colorMode: ColorMode;
  lightTheme?: CourierPreferencesTheme;
  darkTheme?: CourierPreferencesTheme;
}

export function CourierPreferencesTab({ colorMode, lightTheme, darkTheme }: CourierPreferencesTabProps) {
  return (
    <div className="h-full overflow-y-auto">
      <CourierPreferences
        mode={colorMode}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
      />
    </div>
  );
}
