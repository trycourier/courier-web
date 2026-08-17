import { useMemo } from 'react';
import { CourierInbox } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';
import { COMPONENT_BORDER } from './photoShootThemes';

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
            both, in the border the component draws internally. The width is set
            so every message fits the frame without the list scrolling. */}
        <div
          style={{
            width: '700px',
            backgroundColor: '#ffffff',
            border: `1px solid ${COMPONENT_BORDER}`,
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
