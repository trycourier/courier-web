'use client';

import { CourierToast } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierToastTabProps {
  colorMode: ColorMode;
}

export function CourierToastTab({ colorMode }: CourierToastTabProps) {
  return (
    <div className="h-full p-4 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-center">
        Send a test message from the Test tab to preview default Courier toasts.
      </p>
      <div className="relative flex-1 rounded-md border border-border bg-muted/20 overflow-hidden">
        <CourierToast
          mode={colorMode}
          style={{
            position: 'absolute',
            top: '56px',
            right: '24px',
          }}
        />
      </div>
    </div>
  );
}
