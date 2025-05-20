import React from 'react';
import { Courier, CourierProps, InboxMessage } from '@trycourier/courier-js';
import { CourierInboxDatastore, CourierInboxDataStoreListener, CourierInboxFeedType, InboxDataSet } from '@trycourier/courier-ui-inbox';

type AuthenticationHooks = {
  userId?: string,
  signIn: (props: CourierProps) => void,
  signOut: () => void
}

type InboxHooks = {
  load: (props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) => Promise<void>,
  fetchNextPageOfMessages: (props: { feedType: CourierInboxFeedType }) => Promise<InboxDataSet | null>,
  setPaginationLimit: (limit: number) => void,
  readMessage: (message: InboxMessage) => Promise<void>,
  unreadMessage: (message: InboxMessage) => Promise<void>,
  clickMessage: (message: InboxMessage) => Promise<void>,
  archiveMessage: (message: InboxMessage) => Promise<void>,
  openMessage: (message: InboxMessage) => Promise<void>,
  inbox?: InboxDataSet,
  archive?: InboxDataSet,
  unreadCount?: number,
  error?: Error
}

// A hook for managing the shared state of Courier
// If you want to use more functions, checkout the Courier JS SDK which
// can be used directly by importing from '@trycourier/courier-js'
export const useCourier = () => {

  // Authentication Functions 
  const signIn = (props: CourierProps) => Courier.shared.signIn(props);
  const signOut = () => Courier.shared.signOut();

  // Inbox Functions
  const loadInbox = (props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) => CourierInboxDatastore.shared.load(props);
  const fetchNextPageOfMessages = (props: { feedType: CourierInboxFeedType }) => CourierInboxDatastore.shared.fetchNextPageOfMessages(props);
  const setPaginationLimit = (limit: number) => Courier.shared.paginationLimit = limit;
  const readMessage = (message: InboxMessage) => CourierInboxDatastore.shared.readMessage(message);
  const unreadMessage = (message: InboxMessage) => CourierInboxDatastore.shared.unreadMessage(message);
  const clickMessage = (message: InboxMessage) => CourierInboxDatastore.shared.clickMessage(message);
  const archiveMessage = (message: InboxMessage) => CourierInboxDatastore.shared.archiveMessage(message);
  const openMessage = (message: InboxMessage) => CourierInboxDatastore.shared.openMessage(message);

  // State
  const [auth, setAuth] = React.useState<AuthenticationHooks>({
    userId: undefined,
    signIn,
    signOut
  });

  const [inbox, setInbox] = React.useState<InboxHooks>({
    load: loadInbox,
    fetchNextPageOfMessages,
    setPaginationLimit,
    readMessage,
    unreadMessage,
    clickMessage,
    archiveMessage,
    openMessage
  });

  React.useEffect(() => {

    // Add a listener to the Courier instance
    const listener = Courier.shared.addAuthenticationListener(() => refreshAuth());

    // Add inbox data store listener
    const inboxListener = new CourierInboxDataStoreListener({
      onError: (error) => refreshInbox(error),
      onDataSetChange: () => refreshInbox(),
      onPageAdded: () => refreshInbox(),
      onMessageAdd: () => refreshInbox(),
      onMessageRemove: () => refreshInbox(),
      onMessageUpdate: () => refreshInbox(),
      onUnreadCountChange: () => refreshInbox()
    });
    CourierInboxDatastore.shared.addDataStoreListener(inboxListener);

    // Set initial values
    refreshAuth();
    refreshInbox();

    // Remove listeners when the component unmounts
    return () => {
      listener.remove();
      inboxListener.remove();
    };
  }, []);

  const refreshAuth = () => {
    const options = Courier.shared.client?.options;
    setAuth({
      userId: options?.userId,
      signIn,
      signOut
    });
  }

  const refreshInbox = (error?: Error) => {
    const datastore = CourierInboxDatastore.shared;
    setInbox({
      load: loadInbox,
      fetchNextPageOfMessages,
      setPaginationLimit,
      readMessage,
      unreadMessage,
      clickMessage,
      archiveMessage,
      openMessage,
      inbox: datastore.inboxDataSet,
      archive: datastore.archiveDataSet,
      unreadCount: datastore.unreadCount,
      error: error,
    });
  }

  return {
    shared: Courier.shared,
    auth: auth,
    inbox: inbox,
  };
};
