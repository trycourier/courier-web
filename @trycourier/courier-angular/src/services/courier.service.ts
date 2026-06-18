import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, type Observable } from "rxjs";
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

/** Authentication state exposed by {@link CourierService.auth$}. */
export interface CourierAuthState {
  userId?: string;
}

/** Inbox state exposed by {@link CourierService.inbox$}. */
export interface CourierInboxState {
  feeds: Record<string, InboxDataSet>;
  totalUnreadCount?: number;
  error?: Error;
}

/** Toast state exposed by {@link CourierService.toast$}. */
export interface CourierToastState {
  error?: Error;
}

/**
 * Injectable wrapper around the shared Courier datastores.
 *
 * Mirrors the React `useCourier` hook / Vue `useCourier` composable: it exposes
 * auth, inbox, and toast slices as RxJS `Observable`s that emit as the
 * underlying datastores change, plus the same imperative action methods and
 * preferences API. Listeners are registered on construction and removed on
 * service teardown.
 *
 * If you want to use more functions, check out the Courier JS SDK which can be
 * used directly by importing from the courier-js package.
 */
@Injectable({ providedIn: "root" })
export class CourierService implements OnDestroy {
  /** The shared Courier singleton. */
  readonly shared = Courier.shared;

  private readonly _auth = new BehaviorSubject<CourierAuthState>({ userId: undefined });
  private readonly _inbox = new BehaviorSubject<CourierInboxState>({ feeds: {} });
  private readonly _toast = new BehaviorSubject<CourierToastState>({});

  /** Authentication state stream. */
  readonly auth$: Observable<CourierAuthState> = this._auth.asObservable();
  /** Inbox state stream (feeds, unread count, error). */
  readonly inbox$: Observable<CourierInboxState> = this._inbox.asObservable();
  /** Toast state stream. */
  readonly toast$: Observable<CourierToastState> = this._toast.asObservable();

  private readonly authListener = Courier.shared.addAuthenticationListener(() => this.refreshAuth());
  private readonly inboxListener = new CourierInboxDataStoreListener({
    onError: (error: Error) => this.refreshInbox(error),
    onDataSetChange: () => this.refreshInbox(),
    onPageAdded: () => this.refreshInbox(),
    onMessageAdd: () => this.refreshInbox(),
    onMessageRemove: () => this.refreshInbox(),
    onMessageUpdate: () => this.refreshInbox(),
    onUnreadCountChange: () => this.refreshInbox(),
    onTotalUnreadCountChange: () => this.refreshInbox(),
  });
  private readonly toastListener = new CourierToastDatastoreListener({
    onMessageAdd: () => this.refreshToast(),
    onMessageRemove: () => this.refreshToast(),
    onError: (error: Error) => this.refreshToast(error),
  });

  constructor() {
    CourierInboxDatastore.shared.addDataStoreListener(this.inboxListener);
    CourierToastDatastore.shared.addDatastoreListener(this.toastListener);

    // Set initial values
    this.refreshAuth();
    this.refreshInbox();
    this.refreshToast();
  }

  // Authentication
  signIn(props: CourierProps): void {
    Courier.shared.signIn(props);
  }
  signOut(): void {
    Courier.shared.signOut();
  }

  // Inbox actions
  load(props?: { canUseCache: boolean }): Promise<void> {
    return CourierInboxDatastore.shared.load(props);
  }
  fetchNextPageOfMessages(props: { datasetId: string }): Promise<InboxDataSet | null> {
    return CourierInboxDatastore.shared.fetchNextPageOfMessages(props);
  }
  setPaginationLimit(limit: number): void {
    Courier.shared.paginationLimit = limit;
  }
  readMessage(message: InboxMessage): Promise<void> {
    return CourierInboxDatastore.shared.readMessage({ message });
  }
  unreadMessage(message: InboxMessage): Promise<void> {
    return CourierInboxDatastore.shared.unreadMessage({ message });
  }
  clickMessage(message: InboxMessage): Promise<void> {
    return CourierInboxDatastore.shared.clickMessage({ message });
  }
  archiveMessage(message: InboxMessage): Promise<void> {
    return CourierInboxDatastore.shared.archiveMessage({ message });
  }
  openMessage(message: InboxMessage): void {
    return CourierInboxDatastore.shared.openMessage({ message });
  }
  unarchiveMessage(message: InboxMessage): Promise<void> {
    return CourierInboxDatastore.shared.unarchiveMessage({ message });
  }
  readAllMessages(): Promise<void> {
    return CourierInboxDatastore.shared.readAllMessages();
  }
  registerFeeds(feeds: CourierInboxFeed[]): void {
    return CourierInboxDatastore.shared.registerFeeds(feeds);
  }
  listenForUpdates(): Promise<void> {
    return CourierInboxDatastore.shared.listenForUpdates();
  }

  // Toast actions
  addToastMessage(message: InboxMessage): void {
    CourierToastDatastore.shared.addMessage(message);
  }
  removeToastMessage(message: InboxMessage): void {
    CourierToastDatastore.shared.removeMessage(message);
  }

  // Preferences
  getUserPreferences(props?: { paginationCursor?: string }): Promise<CourierUserPreferences> {
    return Courier.shared.client!.preferences.getUserPreferences(props);
  }
  getUserPreferenceTopic(props: { topicId: string }): Promise<CourierUserPreferencesTopic> {
    return Courier.shared.client!.preferences.getUserPreferenceTopic(props);
  }
  putUserPreferenceTopic(props: {
    topicId: string;
    status: CourierUserPreferencesStatus;
    hasCustomRouting: boolean;
    customRouting: CourierUserPreferencesChannel[];
    digestSchedule?: string;
  }): Promise<CourierUserPreferencesTopic> {
    return Courier.shared.client!.preferences.putUserPreferenceTopic(props);
  }
  getDigestSchedules(props: { topicId: string }): Promise<CourierDigestScheduleOption[]> {
    return Courier.shared.client!.preferences.getDigestSchedules(props);
  }
  getNotificationCenterUrl(props: { clientKey: string }): string {
    return Courier.shared.client!.preferences.getNotificationCenterUrl(props);
  }

  private refreshAuth(): void {
    this._auth.next({ userId: Courier.shared.client?.options.userId });
  }

  private refreshInbox(error?: Error): void {
    const datastore = CourierInboxDatastore.shared;
    this._inbox.next({
      feeds: datastore.getDatasets(),
      totalUnreadCount: datastore.totalUnreadCount,
      error,
    });
  }

  private refreshToast(error?: Error): void {
    this._toast.next({ error });
  }

  ngOnDestroy(): void {
    this.authListener.remove();
    this.inboxListener.remove();
    this.toastListener.remove();
  }
}
