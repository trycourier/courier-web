import { type InboxMessage } from '@trycourier/courier-react';

/**
 * One continuous story for every photo shoot: a single pro over one week, getting
 * matched to work, cleared to do it, and paid for it. Every message either pays
 * them, costs them the job, or moves their day — nothing is just "read this".
 *
 * Written oldest to newest below (the order the week happened), and returned
 * newest first, the order an inbox shows them in. Dollar amounts, addresses, and
 * account digits are invented for the example.
 *
 * Titles carry no closing period — Slack, Gmail, iOS, and Material all treat a
 * notification title as a label rather than a sentence — while bodies are
 * written as full sentences and keep theirs.
 */
const STORY: Array<Omit<InboxMessage, 'created' | 'read'> & { minutesAgo: number; unread?: boolean }> = [
  {
    messageId: 'job-invite',
    minutesAgo: 6 * 24 * 60,
    title: 'New job 4 miles away: kitchen install, Thursday 8am. $840',
    preview: 'Respond by 6pm today. 3 pros invited.',
    actions: [{ content: 'Accept' }, { content: 'Pass' }],
  },
  {
    messageId: 'job-booked',
    minutesAgo: 5 * 24 * 60,
    title: "You're booked for the Maple Street install",
    preview: 'Thursday 8am to 2pm. Customer contact unlocks 24 hours before.',
    actions: [{ content: 'View job' }],
  },
  {
    messageId: 'credential-expiring',
    minutesAgo: 4 * 24 * 60,
    title: 'Your liability insurance expires March 2',
    preview: 'New jobs pause until you upload a current certificate.',
    actions: [{ content: 'Upload certificate' }],
  },
  {
    messageId: 'signature-needed',
    minutesAgo: 3 * 24 * 60,
    title: 'Work order #4412 needs your signature',
    preview: 'Sign before Thursday 8am or the job releases back to the pool.',
    actions: [{ content: 'Review and sign' }],
  },
  {
    messageId: 'note-left',
    minutesAgo: 2 * 24 * 60 + 180,
    title: 'Dana left you a note on Maple Street',
    preview: '“Gate code is 4417, dog is friendly but loud.”',
    actions: [{ content: 'Reply' }],
  },
  {
    messageId: 'schedule-moved',
    minutesAgo: 2 * 24 * 60,
    title: 'Maple Street moved to Friday 8am',
    preview: 'Customer rescheduled. Your Thursday is now open.',
    actions: [{ content: 'Confirm' }, { content: "Can't make Friday" }],
  },
  {
    messageId: 'invoice-approved',
    minutesAgo: 5 * 60,
    title: 'Invoice #2210 is approved. $3,120 arrives Tuesday',
    preview: 'Includes the $480 change order. Paid to account ending 4417.',
    actions: [{ content: 'View invoice' }],
  },
  // Sits above the invoice in the list: an approval still waiting on the pro
  // outranks a loop that already closed.
  {
    messageId: 'change-order',
    minutesAgo: 3 * 60,
    title: 'Change order needs your approval: +$480',
    preview: 'Customer added under-cabinet lighting. 2 hours of labor.',
    actions: [{ content: 'Approve' }, { content: 'Decline' }],
  },
  {
    messageId: 'export-ready',
    minutesAgo: 2 * 60,
    title: 'Your Q3 earnings summary is ready',
    preview: '41 jobs, $28,400. Available for 7 days.',
    unread: true,
    actions: [{ content: 'Download' }],
  },
  {
    messageId: 'rollup',
    minutesAgo: 12,
    title: '6 updates while you were on site',
    preview: '2 new job invites, 3 notes, 1 payment.',
    unread: true,
    actions: [{ content: 'View all' }],
  },
];

/**
 * The story as inbox messages, newest first. Built per call so timestamps stay
 * relative to page load.
 */
export function createPreviewMessages(): InboxMessage[] {
  const now = Date.now();
  const at = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  return STORY.map(({ minutesAgo, unread, ...message }) => ({
    ...message,
    created: at(minutesAgo),
    // Read a little after it arrived, for everything the pro has caught up on.
    ...(unread ? {} : { read: at(Math.max(minutesAgo - 30, 1)) }),
  })).reverse();
}

/** The newest message on its own — the one a toast would announce. */
export function createToastMessage(): InboxMessage {
  const [newest] = createPreviewMessages();
  return newest;
}

/** The first job invite, which reads best as an incoming alert. */
export function createJobInviteMessage(): InboxMessage {
  const messages = createPreviewMessages();
  return messages[messages.length - 1];
}
