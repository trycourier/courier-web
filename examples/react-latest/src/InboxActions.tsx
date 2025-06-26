import { useEffect } from 'react'
import { CourierInbox, useCourier, type CourierInboxListItemFactoryProps, type CourierInboxListItemActionFactoryProps } from '@trycourier/courier-react'

export default function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });
  }, []);

  return (
    <CourierInbox
      onMessageClick={({ message, index }: CourierInboxListItemFactoryProps) => {
        alert("Message clicked at index " + index + ":\n" + JSON.stringify(message, null, 2));
      }}
      onMessageActionClick={({ message, action, index }: CourierInboxListItemActionFactoryProps) => {
        alert(
          "Message action clicked at index " + index + ":\n" +
          "Action: " + JSON.stringify(action, null, 2) + "\n" +
          "Message: " + JSON.stringify(message, null, 2)
        );
      }}
      onMessageLongPress={({ message, index }: CourierInboxListItemFactoryProps) => {
        alert("Message long pressed at index " + index + ":\n" + JSON.stringify(message, null, 2));
      }}
    />
  );

}
