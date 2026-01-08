import type { CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export function createMessageClickHandler() {
  return ({ message }: CourierInboxListItemFactoryProps) => {
    alert(JSON.stringify(message, null, 2));
  };
}

export function createMessageActionClickHandler() {
  return ({ action, message }: { action: any; message: any }) => {
    alert(`Action clicked!\n\nAction: ${JSON.stringify(action, null, 2)}\n\nMessage: ${JSON.stringify(message, null, 2)}`);
  };
}

