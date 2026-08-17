import { type InboxMessage } from '@trycourier/courier-react';

export type Person = {
  name: string;
  /** Who they are to the pro, for the message copy. */
  role: string;
  photo: string;
};

/**
 * The people around the pro's week — the same story as [previewMessages], told
 * from the side where a person, not a system, is on the other end.
 *
 * Photos are Unsplash URLs. Unsplash is one of the few image hosts that sends
 * `access-control-allow-origin`, which the PNG export needs to inline them; hosts
 * without it (pravatar, randomuser) show on screen but export blank.
 */
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?w=160&h=160&fit=crop&crop=faces&q=80`;

export const PEOPLE: Record<string, Person> = {
  dana: {
    name: 'Dana Whitfield',
    role: 'Site coordinator',
    photo: photo('photo-1494790108377-be9c29b29330'),
  },
  marcus: {
    name: 'Marcus Reed',
    role: 'Customer',
    photo: photo('photo-1507003211169-0a1dd7228f2d'),
  },
  priya: {
    name: 'Priya Raman',
    role: 'Dispatcher',
    photo: photo('photo-1544005313-94ddf0286df2'),
  },
  tom: {
    name: 'Tom Alvarez',
    role: 'Crew lead',
    photo: photo('photo-1472099645785-5658abf4ff4e'),
  },
  rosa: {
    name: 'Rosa Lindqvist',
    role: 'Customer',
    photo: photo('photo-1438761681033-6461ffad8d80'),
  },
};

const STORY: Array<{
  messageId: string;
  personId: keyof typeof PEOPLE;
  minutesAgo: number;
  title: string;
  preview: string;
  unread?: boolean;
}> = [
  {
    messageId: 'people-note',
    personId: 'dana',
    minutesAgo: 12,
    title: 'Dana left you a note on Maple Street',
    preview: '“Gate code is 4417, dog is friendly but loud.”',
    unread: true,
  },
  {
    messageId: 'people-approval',
    personId: 'marcus',
    minutesAgo: 60,
    title: 'Marcus approved your change order',
    preview: '+$480 for under-cabinet lighting, approved at 2:14pm.',
    unread: true,
  },
  {
    messageId: 'people-reschedule',
    personId: 'priya',
    minutesAgo: 3 * 60,
    title: 'Priya moved your Thursday job to Friday',
    preview: 'Maple Street, 8am to 2pm. Confirm when you can.',
  },
  {
    messageId: 'people-late',
    personId: 'tom',
    minutesAgo: 5 * 60,
    title: 'Tom is running 20 minutes late',
    preview: "Traffic on the interstate. He'll meet you on site.",
  },
  {
    messageId: 'people-review',
    personId: 'rosa',
    minutesAgo: 26 * 60,
    title: 'Rosa left you a 5-star review',
    preview: '“Clean work, on time, explained everything.”',
  },
];

/** The people-first messages, newest first, with their sender on `data`. */
export function createPeopleMessages(): InboxMessage[] {
  const now = Date.now();
  const at = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  return STORY.map(({ minutesAgo, unread, personId, ...message }) => ({
    ...message,
    data: { personId },
    created: at(minutesAgo),
    ...(unread ? {} : { read: at(Math.max(minutesAgo - 30, 1)) }),
  }));
}

/** The sender behind a message, for a custom list item to draw. */
export function personFor(message: InboxMessage): Person | undefined {
  const personId = message.data?.personId as string | undefined;
  return personId ? PEOPLE[personId] : undefined;
}
