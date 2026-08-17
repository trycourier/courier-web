import { useMemo } from 'react';
import { CourierInboxPopupMenu } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';

/** Photo shoot: the popup menu opening beneath a centered button. */
export default function PhotoShootPopup() {

  // Preview messages render without a sign-in or any network calls. Three fit
  // the popup whole; a fourth would be cut off by the frame.
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);

  return (
    <PhotoShootStage fileName="courier-inbox-popup">
      {/* The menu button sits centered at the top; "top-center" hangs the popup
          directly beneath it, centered on the button. */}
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <CourierInboxPopupMenu
          mode="light"
          lightTheme={photoShootTheme}
          previewMessages={previewMessages}
          popupAlignment="top-center"
          popupWidth="700px"
          popupHeight="300px"
          top="48px"
        />
      </div>
    </PhotoShootStage>
  );

}
