import { useEffect, useState } from "react";
import { Courier, CourierInboxDatastore, CourierInboxDataStoreListener, type CourierInboxFeedType, type InboxDataSet, type InboxMessage } from "@trycourier/courier-ui-inbox";

export default function App() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {

    // Create the listener
    const listener = new CourierInboxDataStoreListener({
      onError: (error: Error): void => {
        console.error(error);
      },
      onDataSetChange: (dataSet: InboxDataSet, feedType: CourierInboxFeedType): void => {
        console.log("DataSet changed", dataSet, feedType);
      },
      onPageAdded: (dataSet: InboxDataSet, feedType: CourierInboxFeedType): void => {
        console.log("Page added", dataSet, feedType);
      },
      onMessageAdd: (message: InboxMessage, index: number, feedType: CourierInboxFeedType): void => {
        console.log("Message added", message, index, feedType);
      },
      onMessageRemove: (message: InboxMessage, index: number, feedType: CourierInboxFeedType): void => {
        console.log("Message removed", message, index, feedType);
      },
      onMessageUpdate: (message: InboxMessage, index: number, feedType: CourierInboxFeedType): void => {
        console.log("Message updated", message, index, feedType);
      },
      onUnreadCountChange: (unreadCount: number): void => {
        console.log("Unread count changed", unreadCount);
        setUnreadCount(unreadCount);
      },
    });

    // Register the listener
    CourierInboxDatastore.shared.addDataStoreListener(listener);

    // Sign the user in
    // This can be done outside of this class as well.
    // The same use will be registered until you sign them out.
    Courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
    });

    // Load the inbox
    loadInbox({ canUseCache: true }).then(() => {
      console.log("Inbox loaded");
    });

    // Remove the listener when the component unmounts
    return () => {
      CourierInboxDatastore.shared.removeDataStoreListener(listener);
    };

  }, []);

  const loadInbox = async (props: { canUseCache: boolean }) => {
    setIsLoading(true);
    await CourierInboxDatastore.shared.load(props);
    await CourierInboxDatastore.shared.listenForUpdates();
    setIsLoading(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Inbox has {unreadCount} unread messages</div>;

}