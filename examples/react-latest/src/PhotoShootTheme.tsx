import { useMemo } from 'react';
import { CourierInbox } from '@trycourier/courier-react';
import { createPreviewMessages } from './previewMessages';
import PhotoShootStage, { PhotoShootCard } from './PhotoShootStage';
import { inboxTheme } from './photoShootThemes';

/** Photo shoot: "A Courier Inbox with a custom theme" */
export default function PhotoShootTheme() {

  // Preview messages render without a sign-in or any network calls.
  const previewMessages = useMemo(() => createPreviewMessages().slice(0, 3), []);

  return (
    <PhotoShootStage fileName="courier-inbox-theme">
      <PhotoShootCard>
        <CourierInbox
          mode="light"
          height="100%"
          lightTheme={inboxTheme}
          previewMessages={previewMessages}
        />
      </PhotoShootCard>
    </PhotoShootStage>
  );

}
