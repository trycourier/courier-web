'use client';

import { SendMessageForm } from './SendMessageForm';
import { TabFooter } from './TabFooter';

interface SendTestTabProps {
  userId: string;
  apiKey?: string;
}

export function SendTestTab({ userId, apiKey }: SendTestTabProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <SendMessageForm userId={userId} apiKey={apiKey} />
      </div>
      <div className="flex-shrink-0 border-t border-border p-4">
        <TabFooter
          copy="Send test messages to your inbox to see how they appear in real-time."
          primaryButton={{
            label: "Send a Message",
            url: "https://www.courier.com/docs/platform/inbox/sending-a-message"
          }}
        />
      </div>
    </div>
  );
}

