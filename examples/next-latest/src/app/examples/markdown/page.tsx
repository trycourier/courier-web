'use client'

import { useEffect, useState } from 'react'
import {
  CourierInbox,
  useCourier,
} from '@trycourier/courier-react';
import Markdown from 'markdown-to-jsx';
import { getSignInProps } from '../../../courier-env';

export default function MarkdownListItemInbox() {
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

