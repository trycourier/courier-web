import React from 'react';
import { Courier, CourierProps } from '@trycourier/courier-js';
import { CourierInboxDatastore, CourierInboxDataStoreListener, CourierInboxFeedType, InboxDataSet } from '@trycourier/courier-ui-inbox';

type AuthenticationHooks = {
  userId?: string,
  signIn: (props: CourierProps) => void,
  signOut: () => void
}

type InboxHooks = {
  load: (props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) => Promise<void>,
  fetchNextPageOfMessages: (props: { feedType: CourierInboxFeedType }) => Promise<InboxDataSet | null>,
  inbox?: InboxDataSet,
  archive?: InboxDataSet,
  unreadCount?: number,
  error?: Error
}

type CourierHooks = {
  authentication: AuthenticationHooks,
  inbox: InboxHooks
}

// A hook for managing the shared state of Courier
// If you want to use more functions, checkout the Courier JS SDK which
// can be used directly by importing from '@trycourier/courier-js'
export const useCourier = () => {

  const [hooks, setHooks] = React.useState<CourierHooks>({
    authentication: {
      signIn: (props: CourierProps) => Courier.shared.signIn(props),
      signOut: () => Courier.shared.signOut()
    },
    inbox: {
      load: (props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) => CourierInboxDatastore.shared.load(props),
      fetchNextPageOfMessages: (props: { feedType: CourierInboxFeedType }) => CourierInboxDatastore.shared.fetchNextPageOfMessages(props)
    }
  });

  // Setup
  React.useEffect(() => {

    // Add a listener to the Courier instance
    const listener = Courier.shared.addAuthenticationListener(() => refreshValues());

    // Add inbox data store listener
    const inboxListener = new CourierInboxDataStoreListener({
      onError: (error) => refreshValues(error),
      onDataSetChange: () => refreshValues(),
      onPageAdded: () => refreshValues(),
      onMessageAdd: () => refreshValues(),
      onMessageRemove: () => refreshValues(),
      onMessageUpdate: () => refreshValues(),
      onUnreadCountChange: () => refreshValues()
    });
    CourierInboxDatastore.shared.addDataStoreListener(inboxListener);

    // Set initial values
    refreshValues();

    // Remove listeners when the component unmounts
    return () => {
      listener.remove();
      inboxListener.remove();
    };
  }, []);

  const refreshValues = (error?: Error) => {
    const options = Courier.shared.client?.options;
    const datastore = CourierInboxDatastore.shared;
    setHooks({
      authentication: {
        userId: options?.userId,
        signIn: (props: CourierProps) => Courier.shared.signIn(props),
        signOut: () => Courier.shared.signOut()
      },
      inbox: {
        load: (props?: { feedType: CourierInboxFeedType, canUseCache: boolean }) => datastore.load(props),
        fetchNextPageOfMessages: (props: { feedType: CourierInboxFeedType }) => datastore.fetchNextPageOfMessages(props),
        inbox: datastore.inboxDataSet,
        archive: datastore.archiveDataSet,
        unreadCount: datastore.unreadCount,
        error: error,
      }
    });
  }

  return {
    shared: Courier.shared,
    hooks: hooks,
  };
};
