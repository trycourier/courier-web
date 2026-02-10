'use client';

import { CourierToast } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierToastTabProps {
  colorMode: ColorMode;
}

export function CourierToastTab({ colorMode }: CourierToastTabProps) {
  return (
    <div className="h-full p-4">
      <p className="text-sm text-muted-foreground">
        Send a test message from the Test tab to preview default Courier toasts.
      </p>
      <CourierToast mode={colorMode} />
    </div>
  );
}
