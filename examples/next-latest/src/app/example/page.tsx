'use client'

import { ExampleReact } from '@trycourier/courier-react';
import { ExampleBaseListItem } from '@trycourier/courier-ui-inbox';

export default function Home() {

  return (
    <ExampleReact
      renderItem={(props: ExampleBaseListItem) => {
        return <p className='test'>{props.index}</p>
      }}
    />
  )

}
