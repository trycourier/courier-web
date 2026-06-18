import { onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from "vue";
import {
  Courier,
  type CourierProps,
  type CourierDigestScheduleOption,
  type CourierUserPreferences,
  type CourierUserPreferencesChannel,
  type CourierUserPreferencesStatus,
  type CourierUserPreferencesTopic,
  type InboxMessage,
} from "@trycourier/courier-js";
import {
  CourierInboxDatastore,
  CourierInboxDataStoreListener,
  type CourierInboxFeed,
  type InboxDataSet,
} from "@trycourier/courier-ui-inbox";
import { CourierToastDatastore, CourierToastDatastoreListener } from "@trycourier/courier-ui-toast";

export type AuthenticationHooks = {
  userId?: string;
  signIn: (props: CourierProps) => void;
  signOut: () => void;
};

export type InboxHooks = {
  load: (props?: { canUseCache: boolean }) => Promise<void>;
  fetchNextPageOfMessages: (props: { datasetId: string }) => Promise<InboxDataSet | null>;
  setPaginationLimit: (limit: number) => void;
  readMessage: (message: InboxMessage) => Promise<void>;
  unreadMessage: (message: InboxMessage) => Promise<void>;
  clickMessage: (message: InboxMessage) => Promise<void>;
  archiveMessage: (message: InboxMessage) => Promise<void>;
  openMessage: (message: InboxMessage) => void;
  unarchiveMessage: (message: InboxMessage) => Promise<void>;
  readAllMessages: () => Promise<void>;
  registerFeeds: (feeds: CourierInboxFeed[]) => void;
  listenForUpdates: () => Promise<void>;
  feeds: Record<string, InboxDataSet>;
  totalUnreadCount?: number;
  error?: Error;
};

export type ToastHooks = {
  addMessage: (message: InboxMessage) => void;
  removeMessage: (message: InboxMessage) => void;
  error?: Error;
};

export type PreferencesHooks = {
  getUserPreferences: (props?: { paginationCursor?: string }) => Promise<CourierUserPreferences>;
  getUserPreferenceTopic: (props: { topicId: string }) => Promise<CourierUserPreferencesTopic>;
  putUserPreferenceTopic: (props: {
    topicId: string;
    status: CourierUserPreferencesStatus;
    hasCustomRouting: boolean;
    customRouting: CourierUserPreferencesChannel[];
    digestSchedule?: string;
  }) => Promise<CourierUserPreferencesTopic>;
  getDigestSchedules: (props: { topicId: string }) => Promise<CourierDigestScheduleOption[]>;
  getNotificationCenterUrl: (props: { clientKey: string }) => string;
};

export type UseCourierResult = {
  shared: typeof Courier.shared;
  auth: ShallowRef<AuthenticationHooks>;
  inbox: ShallowRef<InboxHooks>;
  toast: ShallowRef<ToastHooks>;
  preferences: PreferencesHooks;
};

/**
 * A composable for managing the shared state of Courier.
 *
 * Mirrors the React `useCourier` hook: it returns the same
 * `{ shared, auth, inbox, toast, preferences }` shape, but `auth`, `inbox`, and
 * `toast` are Vue `shallowRef`s that update reactively as the underlying
 * datastores change. Listeners are registered on mount and removed on unmount.
 *
 * If you want to use more functions, check out the Courier JS SDK which can be
 * used directly by importing from the courier-js package.
 */
export const useCourier = (): UseCourierResult => {
  // Authentication functions
  const signIn = (props: CourierProps) => Courier.shared.signIn(props);
  const signOut = () => Courier.shared.signOut();

  // Inbox functions
  const loadInbox = (props?: { canUseCache: boolean }) => CourierInboxDatastore.shared.load(props);
  const fetchNextPageOfMessages = (props: { datasetId: string }) =>
    CourierInboxDatastore.shared.fetchNextPageOfMessages(props);
  const setPaginationLimit = (limit: number) => (Courier.shared.paginationLimit = limit);
  const readMessage = (message: InboxMessage) => CourierInboxDatastore.shared.readMessage({ message });
  const unreadMessage = (message: InboxMessage) => CourierInboxDatastore.shared.unreadMessage({ message });
  const clickMessage = (message: InboxMessage) => CourierInboxDatastore.shared.clickMessage({ message });
  const archiveMessage = (message: InboxMessage) => CourierInboxDatastore.shared.archiveMessage({ message });
  const openMessage = (message: InboxMessage) => CourierInboxDatastore.shared.openMessage({ message });
  const unarchiveMessage = (message: InboxMessage) => CourierInboxDatastore.shared.unarchiveMessage({ message });
  const readAllMessages = () => CourierInboxDatastore.shared.readAllMessages();
  const registerFeeds = (feeds: CourierInboxFeed[]) => CourierInboxDatastore.shared.registerFeeds(feeds);
  const listenForUpdates = () => CourierInboxDatastore.shared.listenForUpdates();

  // Toast functions
  const addToastMessage = (message: InboxMessage) => CourierToastDatastore.shared.addMessage(message);
  const removeToastMessage = (message: InboxMessage) => CourierToastDatastore.shared.removeMessage(message);

  const inboxActions = {
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
  };

  // Reactive state
  const auth = shallowRef<AuthenticationHooks>({ userId: undefined, signIn, signOut });
  const inbox = shallowRef<InboxHooks>({ ...inboxActions, feeds: {} });
  const toast = shallowRef<ToastHooks>({ addMessage: addToastMessage, removeMessage: removeToastMessage });

  const preferences: PreferencesHooks = {
    getUserPreferences: (props) => Courier.shared.client!.preferences.getUserPreferences(props),
    getUserPreferenceTopic: (props) => Courier.shared.client!.preferences.getUserPreferenceTopic(props),
    putUserPreferenceTopic: (props) => Courier.shared.client!.preferences.putUserPreferenceTopic(props),
    getDigestSchedules: (props) => Courier.shared.client!.preferences.getDigestSchedules(props),
    getNotificationCenterUrl: (props) => Courier.shared.client!.preferences.getNotificationCenterUrl(props),
  };

  const refreshAuth = () => {
    const options = Courier.shared.client?.options;
    auth.value = { userId: options?.userId, signIn, signOut };
  };

  const refreshInbox = (error?: Error) => {
    const datastore = CourierInboxDatastore.shared;
    inbox.value = {
      ...inboxActions,
      feeds: datastore.getDatasets(),
      totalUnreadCount: datastore.totalUnreadCount,
      error,
    };
  };

  const refreshToast = (error?: Error) => {
    toast.value = { addMessage: addToastMessage, removeMessage: removeToastMessage, error };
  };

  onMounted(() => {
    const authListener = Courier.shared.addAuthenticationListener(() => refreshAuth());

    const inboxListener = new CourierInboxDataStoreListener({
      onError: (error: Error) => refreshInbox(error),
      onDataSetChange: () => refreshInbox(),
      onPageAdded: () => refreshInbox(),
      onMessageAdd: () => refreshInbox(),
      onMessageRemove: () => refreshInbox(),
      onMessageUpdate: () => refreshInbox(),
      onUnreadCountChange: () => refreshInbox(),
      onTotalUnreadCountChange: () => refreshInbox(),
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

    onBeforeUnmount(() => {
      authListener.remove();
      inboxListener.remove();
      toastListener.remove();
    });
  });

  return {
    shared: Courier.shared,
    auth,
    inbox,
    toast,
    preferences,
  };
};
