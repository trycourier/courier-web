import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import {
  CourierInbox,
  useCourier,
} from '@trycourier/courier-react-17';
import Markdown from 'markdown-to-jsx';

const MarkdownListItemInbox: NextPage = () => {
  const [courierJwt, setCourierJwt] = useState<string>()
  const refreshCourierJwt = async () => {
    await new Promise((resolve, _) => window.setTimeout(resolve, 10));
    setCourierJwt(process.env.NEXT_PUBLIC_JWT!);
  };

  const courier = useCourier();

  useEffect(() => {
    refreshCourierJwt();
  }, []);

  useEffect(() => {
    courier.shared.signIn({
      userId: process.env.NEXT_PUBLIC_USER_ID!,
      jwt: courierJwt,
    });
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

export default MarkdownListItemInbox;

