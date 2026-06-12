import { InboxMessage } from "@trycourier/courier-js";
import { CourierBannerDatastore } from "../banner-datastore";
import { CourierBannerDatastoreListener } from "../banner-datastore-listener";

describe('CourierBannerDatastore expiry', () => {
  let added: InboxMessage[];
  let removed: InboxMessage[];
  let listener: CourierBannerDatastoreListener;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    added = [];
    removed = [];
    listener = new CourierBannerDatastoreListener({
      onMessageAdd: (m) => added.push(m),
      onMessageRemove: (m) => removed.push(m),
    });
    CourierBannerDatastore.shared.addDatastoreListener(listener);
  });

  afterEach(() => {
    listener.remove();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('adds a message with no expiry', () => {
    const message: InboxMessage = { messageId: 'no-expiry' };
    CourierBannerDatastore.shared.addMessage(message);
    expect(added.map(m => m.messageId)).toContain('no-expiry');
  });

  it('drops a message whose expiry is already in the past', () => {
    const message: InboxMessage = { messageId: 'past', expiresAt: Date.now() - 1 };
    CourierBannerDatastore.shared.addMessage(message);
    expect(added.map(m => m.messageId)).not.toContain('past');
  });

  it('drops a message whose data.expiresAt is already in the past', () => {
    const message: InboxMessage = { messageId: 'past-data', data: { expiresAt: Date.now() - 1000 } };
    CourierBannerDatastore.shared.addMessage(message);
    expect(added.map(m => m.messageId)).not.toContain('past-data');
  });

  it('adds a message with a future expiry and auto-removes it at expiry', () => {
    const message: InboxMessage = { messageId: 'future', expiresAt: Date.now() + 5000 };
    CourierBannerDatastore.shared.addMessage(message);
    expect(added.map(m => m.messageId)).toContain('future');
    expect(removed.map(m => m.messageId)).not.toContain('future');

    jest.advanceTimersByTime(5000);
    expect(removed.map(m => m.messageId)).toContain('future');
  });

  it('removeMessage clears a pending expiry timer (no double removal)', () => {
    const message: InboxMessage = { messageId: 'manual', expiresAt: Date.now() + 5000 };
    CourierBannerDatastore.shared.addMessage(message);
    CourierBannerDatastore.shared.removeMessage(message);
    expect(removed.filter(m => m.messageId === 'manual')).toHaveLength(1);

    jest.advanceTimersByTime(10000);
    expect(removed.filter(m => m.messageId === 'manual')).toHaveLength(1);
  });
});
