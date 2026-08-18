import { useMemo } from 'react';
import { CourierInbox, CourierInboxPopupMenu } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';
import { COMPONENT_BORDER } from './photoShootThemes';

/** Photo shoot: the inbox filling the left half, the popup centered in the right. */
export default function PhotoShootSplit() {

  // Preview messages render without a sign-in or any network calls. The popup
  // half is narrow, so it shows the first three whole rather than clipping.
  const previewMessages = useMemo(() => createPreviewMessages(), []);
  const popupMessages = useMemo(() => previewMessages.slice(0, 3), [previewMessages]);

  return (
    <PhotoShootStage fileName="courier-inbox-split">
      <div style={{ height: '100%', display: 'flex' }}>
        <div
          style={{
            width: '50%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRight: `1px solid ${COMPONENT_BORDER}`,
          }}
        >
          <CourierInbox
            mode="light"
            height="100%"
            lightTheme={photoShootTheme}
            previewMessages={previewMessages}
          />
        </div>

        {/* The popup is absolutely positioned against its own button, so
            centering the button here centers the popup in this half. */}
        <div
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CourierInboxPopupMenu
            mode="light"
            lightTheme={photoShootTheme}
            previewMessages={popupMessages}
            popupAlignment="center-center"
            popupWidth="340px"
            popupHeight="360px"
          />
        </div>
      </div>
    </PhotoShootStage>
  );

}
