import { useEffect, useState } from 'react'
import {
  CourierInbox,
  useCourier,
} from '@trycourier/courier-react-17';
import { getSignInProps } from './courier-env'
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
    courier.shared.signIn(getSignInProps({ jwt: courierJwt }));
  }, [courierJwt]);

  return (
    <CourierInbox
      renderListItem={props => {
        return (
          <div>
            <Markdown>{props?.message?.preview || ""}</Markdown>
          </div>
        );
      }}
    />
  );
}

