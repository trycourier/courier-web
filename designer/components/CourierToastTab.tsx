'use client';

import { CourierToast, type CourierToastItemClickEvent, type CourierToastItemActionClickEvent } from '@trycourier/courier-react';
import type { ColorMode } from './ThemeTab';

interface CourierToastTabProps {
  colorMode: ColorMode;
}

export function CourierToastTab({ colorMode }: CourierToastTabProps) {
  const handleToastItemClick = ({ message }: CourierToastItemClickEvent) => {
    alert(JSON.stringify(message, null, 2));
  };

  const handleToastItemActionClick = ({ action, message }: CourierToastItemActionClickEvent) => {
    alert(`Action clicked!\n\nAction: ${JSON.stringify(action, null, 2)}\n\nMessage: ${JSON.stringify(message, null, 2)}`);
  };

  return (
    <div className="relative h-full p-5">
      <p className="text-sm text-muted-foreground text-center">
        Send a test message from the Test tab to preview default Courier toasts.
      </p>
      <div className="relative mt-5">
        <CourierToast
          mode={colorMode}
          onToastItemClick={handleToastItemClick}
          onToastItemActionClick={handleToastItemActionClick}
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
