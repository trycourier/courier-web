'use client'

import { ExampleReact } from '@trycourier/courier-react';

export default function Home() {

  return (
    <ExampleReact
      renderItem={props => {
        return <p className="text-red-500">{props.index}</p>
      }}
    />
  );

}
