import { useMemo } from 'react';
import { CourierInbox } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { PhotoShootCard, photoShootTheme } from './PhotoShootStage';

/** Photo shoot: the inbox as a centered card. */
export default function PhotoShootInbox() {

  // Preview messages render without a sign-in or any network calls. Every message
  // carries an action, so three fill the card's fixed height without leaving a gap.
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);

  return (
    <PhotoShootStage fileName="courier-inbox-card">
      {/* The inbox has no background/border of its own, so the card supplies
          both, in the border the component draws internally. */}
      <PhotoShootCard>
        <CourierInbox
          mode="light"
          height="100%"
          lightTheme={photoShootTheme}
          previewMessages={previewMessages}
        />
      </PhotoShootCard>
    </PhotoShootStage>
  );

}
