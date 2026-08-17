import { useMemo } from 'react';
import {
  CourierInbox,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxListItemFactoryProps,
} from '@trycourier/courier-react';
import { createPeopleMessages, personFor } from './previewPeople';
import PhotoShootStage, { photoShootTheme } from './PhotoShootStage';

const FONT = "'Poppins', system-ui, sans-serif";

function CustomHeader({ feeds }: CourierInboxHeaderFactoryProps) {
  const selectedFeed = feeds.find(feed => feed.isSelected);
  const unreadCount = selectedFeed?.tabs.find(tab => tab.isSelected)?.unreadCount ?? 0;

  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderBottom: '1px solid #ecedf1',
        fontFamily: FONT,
      }}
    >
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#171717' }}>
        Notifications
      </span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          padding: '2px 8px',
          borderRadius: '999px',
          backgroundColor: '#ede9fe',
          color: '#6d28d9',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {unreadCount} new
      </span>
    </div>
  );
}

function CustomListItem({ message }: CourierInboxListItemFactoryProps) {
  const person = personFor(message);
  const unread = !message.read;

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid #f2f3f6',
        backgroundColor: unread ? '#faf8ff' : '#ffffff',
        fontFamily: FONT,
      }}
    >
      <img
        src={person?.photo}
        alt={person?.name ?? ''}
        width={36}
        height={36}
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          objectFit: 'cover',
          // A ring on the unread rows, so the sender carries the unread cue.
          boxShadow: unread ? '0 0 0 2px #8B5CF6' : '0 0 0 1px #e4e4e7',
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>
          {message.title}
        </div>
        <div style={{ fontSize: '13px', color: '#71717a' }}>
          {message.preview}
        </div>
        {person && (
          <div style={{ marginTop: '2px', fontSize: '11px', color: '#a1a1aa' }}>
            {person.name} · {person.role}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Photo shoot: "An inbox with a custom header and custom list items, while the
 * SDK still manages the list."
 */
export default function PhotoShootCustomRender() {

  // People-first messages, so the custom row has a face and a sender to show.
  // Each row carries a sender line, so four is what the frame holds.
  const previewMessages = useMemo(() => createPeopleMessages().slice(0, 4), []);

  return (
    <PhotoShootStage fileName="courier-inbox-custom-render">
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '620px',
            backgroundColor: '#ffffff',
            border: '1px solid #d5d8de',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <CourierInbox
            mode="light"
            lightTheme={photoShootTheme}
            previewMessages={previewMessages}
            renderHeader={props => (props ? <CustomHeader {...props} /> : <></>)}
            renderListItem={props => (props ? <CustomListItem {...props} /> : <></>)}
          />
        </div>
      </div>
    </PhotoShootStage>
  );

}
