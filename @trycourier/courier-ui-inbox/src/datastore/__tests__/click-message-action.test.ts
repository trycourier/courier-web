import type { InboxAction } from "@trycourier/courier-js";
import { CourierInboxDatastore } from "../inbox-datastore";

const mockClick = jest.fn();
const mockError = jest.fn();

// Mirrors how the other datastore suites stand the SDK up: the singleton is replaced wholesale
// rather than instantiated, which would pull in browser crypto that jsdom does not provide.
jest.mock("@trycourier/courier-js", () => ({
  Courier: {
    shared: {
      client: {
        inbox: { click: (...args: unknown[]) => mockClick(...args) },
        options: { logger: { error: (...args: unknown[]) => mockError(...args) } }
      }
    }
  }
}));

/**
 * The tracking id travels on the action, not the message, so a click is attributed to the button
 * the reader actually pressed. Matches how the Android SDK and the legacy React inbox report it.
 */
describe('clickMessageAction', () => {
  const messageId = 'msg-1';

  beforeEach(() => {
    mockClick.mockReset().mockResolvedValue(undefined);
    mockError.mockReset();
  });

  it('reports the click using the id on the action', async () => {
    const action: InboxAction = { content: 'Track', data: { trackingId: 'track-abc' } };

    await CourierInboxDatastore.shared.clickMessageAction({ messageId, action });

    expect(mockClick).toHaveBeenCalledWith({ messageId: 'msg-1', trackingId: 'track-abc' });
  });

  it('stays quiet when the action carries no tracking id', async () => {
    // What a template that disabled tracking actually delivers: data present, id absent.
    await CourierInboxDatastore.shared.clickMessageAction({ messageId, action: { content: 'X', data: {} } });
    await CourierInboxDatastore.shared.clickMessageAction({ messageId, action: { content: 'X' } });

    expect(mockClick).not.toHaveBeenCalled();
  });

  it('swallows a failed report rather than breaking the click', async () => {
    mockClick.mockRejectedValue(new Error('network'));
    const action: InboxAction = { content: 'Track', data: { trackingId: 'track-abc' } };

    await expect(CourierInboxDatastore.shared.clickMessageAction({ messageId, action })).resolves.toBeUndefined();
  });
});
