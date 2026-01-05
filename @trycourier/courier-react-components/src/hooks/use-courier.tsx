import React from 'react';
import { Courier, CourierProps, InboxMessage } from '@trycourier/courier-js';
import { CourierInboxDatastore, CourierInboxDataStoreListener, InboxDataSet, CourierInboxFeed } from '@trycourier/courier-ui-inbox';
import { CourierToastDatastore, CourierToastDatastoreListener } from '@trycourier/courier-ui-toast';

type AuthenticationHooks = {
  userId?: string,
  signIn: (props: CourierProps) => void,
  signOut: () => void
}

type InboxHooks = {
  load: (props?: { canUseCache: boolean }) => Promise<void>,
  fetchNextPageOfMessages: (props: { datasetId: string }) => Promise<InboxDataSet | null>,
  setPaginationLimit: (limit: number) => void,
  readMessage: (message: InboxMessage) => Promise<void>,
  unreadMessage: (message: InboxMessage) => Promise<void>,
  clickMessage: (message: InboxMessage) => Promise<void>,
  archiveMessage: (message: InboxMessage) => Promise<void>,
  openMessage: (message: InboxMessage) => Promise<void>,
  unarchiveMessage: (message: InboxMessage) => Promise<void>,
  readAllMessages: () => Promise<void>,
  registerFeeds: (feeds: CourierInboxFeed[]) => void,
  listenForUpdates: () => Promise<void>,
  feeds: Record<string, InboxDataSet>,
  totalUnreadCount?: number,
  error?: Error
}

type ToastHooks = {
  addMessage: (message: InboxMessage) => void;
  removeMessage: (message: InboxMessage) => void;
  error?: Error,
}

// A hook for managing the shared state of Courier
// If you want to use more functions, checkout the Courier JS SDK which
// can be used directly by importing from '@trycourier/courier-js'
export const useCourier = () => {

  // Authentication Functions
  const signIn = (props: CourierProps) => Courier.shared.signIn(props);
  const signOut = () => Courier.shared.signOut();

  // Inbox Functions
  const loadInbox = (props?: { canUseCache: boolean }) => CourierInboxDatastore.shared.load(props);
  const fetchNextPageOfMessages = (props: { datasetId: string }) => CourierInboxDatastore.shared.fetchNextPageOfMessages(props);
  const setPaginationLimit = (limit: number) => Courier.shared.paginationLimit = limit;
  const readMessage = (message: InboxMessage) => CourierInboxDatastore.shared.readMessage({ message });
  const unreadMessage = (message: InboxMessage) => CourierInboxDatastore.shared.unreadMessage({ message });
  const clickMessage = (message: InboxMessage) => CourierInboxDatastore.shared.clickMessage({ message });
  const archiveMessage = (message: InboxMessage) => CourierInboxDatastore.shared.archiveMessage({ message });
  const openMessage = (message: InboxMessage) => CourierInboxDatastore.shared.openMessage({ message });
  const unarchiveMessage = (message: InboxMessage) => CourierInboxDatastore.shared.unarchiveMessage({ message });
  const readAllMessages = () => CourierInboxDatastore.shared.readAllMessages();
  const registerFeeds = (feeds: CourierInboxFeed[]) => CourierInboxDatastore.shared.registerFeeds(feeds);
  const listenForUpdates = () => CourierInboxDatastore.shared.listenForUpdates();

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
    openMessage,
    unarchiveMessage,
    readAllMessages,
    registerFeeds,
    listenForUpdates,
    feeds: {}
  });

  const addToastMessage = (message: InboxMessage) => CourierToastDatastore.shared.addMessage(message);
  const removeToastMessage = (message: InboxMessage) => CourierToastDatastore.shared.removeMessage(message);

  const [toast, setToast] = React.useState<ToastHooks>({
    addMessage: addToastMessage,
    removeMessage: removeToastMessage,
  });

  React.useEffect(() => {

    // Add a listener to the Courier instance
    const listener = Courier.shared.addAuthenticationListener(() => refreshAuth());

    // Add inbox data store listener
    const inboxListener = new CourierInboxDataStoreListener({
      onError: (error: Error) => refreshInbox(error),
      onDataSetChange: () => refreshInbox(),
      onPageAdded: () => refreshInbox(),
      onMessageAdd: () => refreshInbox(),
      onMessageRemove: () => refreshInbox(),
      onMessageUpdate: () => refreshInbox(),
      onUnreadCountChange: () => refreshInbox(),
      onTotalUnreadCountChange: () => refreshInbox()
    });
    CourierInboxDatastore.shared.addDataStoreListener(inboxListener);

    const toastListener = new CourierToastDatastoreListener({
      onMessageAdd: () => refreshToast(),
      onMessageRemove: () => refreshToast(),
      onError: (error: Error) => refreshToast(error),
    });
    CourierToastDatastore.shared.addDatastoreListener(toastListener);

    // Set initial values
    refreshAuth();
    refreshInbox();
    refreshToast();

    // Remove listeners when the component unmounts
    return () => {
      listener.remove();
      inboxListener.remove();
      toastListener.remove();
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
    const allDatasets = datastore.getDatasets();
    setInbox({
      load: loadInbox,
      fetchNextPageOfMessages,
      setPaginationLimit,
      readMessage,
      unreadMessage,
      clickMessage,
      archiveMessage,
      openMessage,
      unarchiveMessage,
      readAllMessages,
      registerFeeds,
      listenForUpdates,
      feeds: allDatasets,
      totalUnreadCount: datastore.totalUnreadCount,
      error: error,
    });
  }

  const refreshToast = (error?: Error) => {
    setToast({
      addMessage: addToastMessage,
      removeMessage: removeToastMessage,
      error,
    });
  };

  return {
    shared: Courier.shared,
    auth: auth,
    inbox: inbox,
    toast: toast,
  };
};
