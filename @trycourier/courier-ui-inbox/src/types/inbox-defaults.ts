import { CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxFeed } from "./inbox-data-set";

/**
 * Header action ID types.
 */
export type CourierInboxHeaderActionId = 'readAll' | 'archiveRead' | 'archiveAll';

/**
 * List item action ID types.
 */
export type CourierInboxListItemActionId = 'read_unread' | 'archive_unarchive';

/**
 * Configuration for a header action.
 */
export type CourierInboxHeaderAction = {
  id: CourierInboxHeaderActionId;
  iconSVG?: string;
  text?: string;
};

/**
 * Configuration for a list item action.
 */
export type CourierInboxListItemAction = {
  id: CourierInboxListItemActionId;
  readIconSVG?: string;
  unreadIconSVG?: string;
  archiveIconSVG?: string;
  unarchiveIconSVG?: string;
};

/**
 * Returns the default feeds for the inbox.
 */
export function defaultFeeds(): CourierInboxFeed[] {
  return [
    {
      id: 'inbox_feed',
      title: 'Inbox',
      iconSVG: CourierIconSVGs.inbox,
      tabs: [
        {
          id: 'all_messages',
          title: 'All Messages',
          filter: {}
        }
      ]
    },
    {
      id: 'archive_feed',
      title: 'Archive',
      iconSVG: CourierIconSVGs.archive,
      tabs: [
        {
          id: 'archived_messages',
          title: 'Archived Messages',
          filter: {
            archived: true
          }
        }
      ]
    }
  ];
}

/**
 * Returns the default header actions.
 */
export function defaultActions(): CourierInboxHeaderAction[] {
  return [
    { id: 'readAll' },
    { id: 'archiveRead' },
    { id: 'archiveAll' }
  ];
}

/**
 * Returns the default list item actions.
 */
export function defaultListItemActions(): CourierInboxListItemAction[] {
  return [
    { id: 'read_unread' },
    { id: 'archive_unarchive' }
  ];
}

