import { useMemo } from 'react';
import { CourierInbox } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';

/** Photo shoot: the inbox as a centered card. */
export default function PhotoShootInbox() {

  // Preview messages render without a sign-in or any network calls. Every message
  // carries an action, so three fill the frame without the card outgrowing it.
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);

  return (
    <PhotoShootStage fileName="courier-inbox-card">
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The inbox has no background/border of its own, so the card supplies
            both to show where the component starts and stops. The width is set
            so all four messages fit the frame without the list scrolling. */}
        <div
          style={{
            width: '700px',
            backgroundColor: '#ffffff',
            border: '1px solid #d5d8de',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <CourierInbox
            mode="light"
            lightTheme={photoShootTheme}
            previewMessages={previewMessages}
          />
        </div>
      </div>
    </PhotoShootStage>
  );

}
