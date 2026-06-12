import { InboxMessage } from "@trycourier/courier-js";
import { getMessageExpiresAt, isMessageExpired } from "../banner";

const baseMessage = (overrides: Partial<InboxMessage>): InboxMessage => ({
  messageId: 'm1',
  ...overrides,
});

describe('getMessageExpiresAt', () => {
  it('reads the top-level expiresAt', () => {
    expect(getMessageExpiresAt(baseMessage({ expiresAt: 1000 }))).toBe(1000);
  });

  it('falls back to data.expiresAt when the top-level field is absent', () => {
    expect(getMessageExpiresAt(baseMessage({ data: { expiresAt: 2000 } }))).toBe(2000);
  });

  it('prefers the top-level field over data.expiresAt', () => {
    expect(getMessageExpiresAt(baseMessage({ expiresAt: 1000, data: { expiresAt: 2000 } }))).toBe(1000);
  });

  it('returns undefined when no expiry is present', () => {
    expect(getMessageExpiresAt(baseMessage({}))).toBeUndefined();
  });

  it('ignores non-numeric data.expiresAt', () => {
    expect(getMessageExpiresAt(baseMessage({ data: { expiresAt: 'soon' } }))).toBeUndefined();
  });
});

describe('isMessageExpired', () => {
  it('is true when expiresAt is at or before now', () => {
    expect(isMessageExpired(baseMessage({ expiresAt: 500 }), 500)).toBe(true);
    expect(isMessageExpired(baseMessage({ expiresAt: 499 }), 500)).toBe(true);
  });

  it('is false when expiresAt is in the future', () => {
    expect(isMessageExpired(baseMessage({ expiresAt: 501 }), 500)).toBe(false);
  });

  it('is false when there is no expiry', () => {
    expect(isMessageExpired(baseMessage({}), 500)).toBe(false);
  });
});
