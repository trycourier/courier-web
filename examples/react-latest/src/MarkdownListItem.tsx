import { useEffect, useState } from 'react'
import { CourierInbox, useCourier, type CourierInboxListItemFactoryProps } from '@trycourier/courier-react'
import Markdown from 'markdown-to-jsx';

export default function MarkdownListItemInbox() {
  const [courierJwt, setCourierJwt] = useState<string>()
  const refreshCourierJwt = async () => {
    await new Promise((resolve, _) => window.setTimeout(resolve, 10));
    setCourierJwt(import.meta.env.VITE_JWT);
  };

  const courier = useCourier();

  useEffect(() => {
    refreshCourierJwt();
  }, []);

  useEffect(() => {
    courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: courierJwt,
    });
  }, [courierJwt]);

  return (
    <CourierInbox
      renderListItem={(props: CourierInboxListItemFactoryProps) => {
        return (
          <div>
            <Markdown>{props.message.preview || ""}</Markdown>
          </div>
        );
      }}
    />
  );
}
