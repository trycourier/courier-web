'use client';

import { CourierToast } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierToastTabProps {
  colorMode: ColorMode;
}

export function CourierToastTab({ colorMode }: CourierToastTabProps) {
  return (
    <div className="relative h-full p-5">
      <p className="text-sm text-muted-foreground text-center">
        Send a test message from the Test tab to preview default Courier toasts.
      </p>
      <div className="relative mt-5">
        <CourierToast
          mode={colorMode}
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
          }}
        />
      </div>
    </div>
  );
}
