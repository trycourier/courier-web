import { useEffect } from 'react'
import { useCourier, type InboxMessage } from '@trycourier/courier-react'

export default function App() {

  const { auth, inbox } = useCourier();

  useEffect(() => {

    // Authenticate the user
    auth.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });

    // Load the inbox
    loadInbox();

  }, []);

  async function loadInbox() {

    // Load the initial inbox data
    await inbox.load();

    // Fetch the next page of messages if possible
    await fetchNextPageOfMessages();
  }

  async function fetchNextPageOfMessages() {
    const nextPage = await inbox.fetchNextPageOfMessages({ feedType: 'inbox' });
    if (nextPage && nextPage.canPaginate) {
      await fetchNextPageOfMessages();
    }
  }

  return (
    <ul>
      {inbox.inbox?.messages.map((message: InboxMessage) => (
        <li key={message.messageId}>{message.title}</li>
      ))}
    </ul>
  );

}
