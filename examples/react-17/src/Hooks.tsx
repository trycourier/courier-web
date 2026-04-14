import { useEffect, useState } from 'react'
import { useCourier, type InboxMessage, type CourierUserPreferencesTopic, defaultFeeds } from '@trycourier/courier-react-17'

export default function App() {

  const { auth, inbox, preferences } = useCourier();
  const [topics, setTopics] = useState<CourierUserPreferencesTopic[]>([]);

  useEffect(() => {

    // Authenticate the user
    auth.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: false,
    });

    // Load the inbox
    loadInbox();

    // Load preferences
    loadPreferences();

  }, []);

  async function loadInbox() {

    inbox.registerFeeds(defaultFeeds());

    // Set up socket listener for real-time updates
    await inbox.listenForUpdates();

    // Load the initial inbox data
    await inbox.load();

    // Fetch the next page of messages if possible
    await fetchNextPageOfMessages();
  }

  async function fetchNextPageOfMessages() {
    const nextPage = await inbox.fetchNextPageOfMessages({ datasetId: 'all_messages' });
    if (nextPage && nextPage.canPaginate) {
      await fetchNextPageOfMessages();
    }
  }

  async function loadPreferences() {
    const prefs = await preferences.getUserPreferences();
    setTopics(prefs.items);
  }

  return (
    <div>
      <div style={{ padding: '24px' }}>Total Unread Count: {inbox.totalUnreadCount}</div>
      <ul>
        {inbox.feeds['all_messages']?.messages.map((message: InboxMessage) => (
          <li key={message.messageId} style={{ backgroundColor: `${message.read ? 'transparent' : 'red'}` }}>{message.title}</li>
        ))}
      </ul>
      <h3>User Preferences</h3>
      <ul>
        {topics.map(topic => (
          <li key={topic.topicId}>{topic.topicName} — {topic.status}</li>
        ))}
      </ul>
    </div>
  );

}

