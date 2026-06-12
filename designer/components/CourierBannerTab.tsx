'use client';

import { useState } from 'react';
import { CourierBanner, type CourierBannerItemClickEvent, type CourierBannerLayout } from '@trycourier/courier-react';
import { Button } from '@/components/ui/button';
import type { ColorMode } from './ThemeTab';

interface CourierBannerTabProps {
  colorMode: ColorMode;
}

const LAYOUTS: CourierBannerLayout[] = ['banner', 'popup', 'custom'];

export function CourierBannerTab({ colorMode }: CourierBannerTabProps) {
  const [layout, setLayout] = useState<CourierBannerLayout>('banner');

  const handleBannerItemClick = ({ message }: CourierBannerItemClickEvent) => {
    alert(JSON.stringify(message, null, 2));
  };

  const handleBannerItemActionClick = ({ action, message }: { action: unknown; message: unknown }) => {
    alert(`Action clicked!\n\nAction: ${JSON.stringify(action, null, 2)}\n\nMessage: ${JSON.stringify(message, null, 2)}`);
  };

  return (
    <div className="relative h-full p-5">
      <p className="text-sm text-muted-foreground text-center">
        Send a test message from the Test tab to preview default Courier banners. Switch the layout below.
      </p>

      <div className="mt-4 flex justify-center gap-2">
        {LAYOUTS.map((l) => (
          <Button
            key={l}
            variant={layout === l ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout(l)}
            className="capitalize"
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="relative mt-5">
        {/* key forces a clean remount when the layout changes */}
        <CourierBanner
          key={layout}
          mode={colorMode}
          layout={layout}
          position="top"
          onBannerItemClick={handleBannerItemClick}
          onBannerItemActionClick={handleBannerItemActionClick}
          renderBannerItem={
            layout === 'custom'
              ? (props) => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '14px 20px',
                      borderRadius: 8,
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                      color: 'white',
                      fontSize: 14,
                    }}
                  >
                    <span>{props.message.title ?? 'Custom banner'}</span>
                    <button
                      onClick={props.dismiss}
                      style={{
                        background: 'white',
                        color: '#4f46e5',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Got it
                    </button>
                  </div>
                )
              : undefined
          }
        />
      </div>
    </div>
  );
}
