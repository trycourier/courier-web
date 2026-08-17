import { useMemo } from 'react';
import { CourierInbox, type InboxMessage } from '@trycourier/courier-react';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';

/** Photo shoot: "A message delivered to the Courier Inbox after a send." */
export default function PhotoShootDelivered() {

  // A single just-arrived message, as a send would leave it: unread, seconds old.
  const previewMessages: InboxMessage[] = useMemo(() => [
    {
      messageId: 'delivered-1',
      title: 'Welcome to Courier 🎉',
      preview: 'This message was delivered to your inbox by the Courier API.',
      created: new Date().toISOString(),
      actions: [
        {
          content: 'View docs',
          href: 'https://www.courier.com',
        },
      ],
    },
  ], []);

  return (
    <PhotoShootStage fileName="courier-inbox-delivered">
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
            width: '620px',
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
