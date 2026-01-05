import type { CourierInboxListItemFactoryProps } from '@trycourier/courier-react';

export function createMessageClickHandler() {
  return ({ message }: CourierInboxListItemFactoryProps) => {
    alert(JSON.stringify(message, null, 2));
  };
}

