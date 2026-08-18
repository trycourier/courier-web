import { useMemo } from 'react';
import { CourierInbox } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage from './PhotoShootStage';
import { COMPONENT_BORDER, inboxTheme } from './photoShootThemes';

/** Photo shoot: "A Courier Inbox with a custom theme" */
export default function PhotoShootTheme() {

  // Preview messages render without a sign-in or any network calls.
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);

  return (
    <PhotoShootStage fileName="courier-inbox-theme">
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
            lightTheme={inboxTheme}
            previewMessages={previewMessages}
          />
        </div>
      </div>
    </PhotoShootStage>
  );

}
