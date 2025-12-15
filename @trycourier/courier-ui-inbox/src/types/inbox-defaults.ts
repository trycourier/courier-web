import { CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxFeed } from "./inbox-data-set";

/**
 * Header action types that can be enabled/disabled in the inbox header.
 */
export type CourierInboxHeaderAction = 'readAll' | 'archiveRead' | 'archiveAll';

/**
 * List item action types that can be enabled/disabled in the inbox list items.
 */
export type CourierInboxListItemAction = 'read_unread' | 'archive_unarchive';

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
  return ['readAll', 'archiveRead', 'archiveAll'];
}

/**
 * Returns the default list item actions.
 */
export function defaultListItemActions(): CourierInboxListItemAction[] {
  return ['read_unread', 'archive_unarchive'];
}

