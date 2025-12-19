'use client';

import { SendMessageForm } from './SendMessageForm';

interface SendTestTabProps {
  userId: string;
}

export function SendTestTab({ userId }: SendTestTabProps) {
  return <SendMessageForm userId={userId} />;
}

