import { renderHook, act, waitFor } from '@testing-library/react';
import { useCourier } from '@trycourier/courier-react-components';
import type { CourierProps, InboxMessage } from '@trycourier/courier-js';
import { env } from '../utils';

function getSignInProps(): CourierProps {
  return {
    userId: env('USER_ID'),
    jwt: env('JWT'),
    apiUrls: {
      courier: {
        rest: env('COURIER_REST_URL'),
        graphql: env('COURIER_GRAPHQL_URL'),
      },
      inbox: {
        graphql: env('INBOX_GRAPHQL_URL'),
        webSocket: env('INBOX_WEBSOCKET_URL'),
      },
    },
  };
}

describe('useCourier (E2E)', () => {
  let unmountLast: (() => void) | undefined;
  let signOutLast: (() => void) | undefined;

  afterEach(() => {
    act(() => {
      signOutLast?.();
      signOutLast = undefined;
      unmountLast?.();
      unmountLast = undefined;
    });
  });

  function renderCourierHook() {
    const rendered = renderHook(() => useCourier());
    unmountLast = rendered.unmount;
    signOutLast = () => {
      const { auth } = rendered.result.current;
      auth.signOut();
    };
    return rendered;
  }

  describe('auth', () => {
    it('should sign in and expose userId', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });

      await waitFor(() => {
        const { auth } = result.current;
        expect(auth.userId).toBe(env('USER_ID'));
      });
      const { shared } = result.current;
      expect(shared.client).toBeDefined();
    });

    it('should sign out and clear userId', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { auth } = result.current;
        expect(auth.userId).toBe(env('USER_ID'));
      });

      act(() => {
        const { auth } = result.current;
        auth.signOut();
      });
      await waitFor(() => {
        const { auth } = result.current;
        expect(auth.userId).toBeUndefined();
      });
      const { shared } = result.current;
      expect(shared.client).toBeUndefined();
    });
  });

  describe('inbox', () => {
    it('should load inbox without error', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { auth } = result.current;
        expect(auth.userId).toBeDefined();
      });

      await act(async () => {
        const { inbox } = result.current;
        await inbox.load();
      });

      const { inbox } = result.current;
      expect(inbox.error).toBeUndefined();
      expect(inbox.feeds).toBeDefined();
    }, 15_000);
  });

  describe('toast', () => {
    it('should add and remove a message without error', async () => {
      const { result } = renderCourierHook();

      const fakeMessage = { messageId: 'e2e-toast-test' } as InboxMessage;

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { auth } = result.current;
        expect(auth.userId).toBeDefined();
      });

      expect(() => {
        act(() => {
          const { toast } = result.current;
          toast.addMessage(fakeMessage);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          const { toast } = result.current;
          toast.removeMessage(fakeMessage);
        });
      }).not.toThrow();

      const { toast } = result.current;
      expect(toast.error).toBeUndefined();
    });
  });

  describe('listeners', () => {
    it('should fire auth listener on sign in and sign out', async () => {
      const { result } = renderCourierHook();
      const spy = jest.fn();
      const { shared } = result.current;
      const listener = shared.addAuthenticationListener(spy);

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: env('USER_ID') });
      });

      act(() => {
        const { auth } = result.current;
        auth.signOut();
      });
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: undefined });
      });

      listener.remove();
    });
  });

  describe('preferences', () => {
    it('should fetch user preferences successfully', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const prefs = await preferences.getUserPreferences();
      expect(prefs.paging.more).toBeDefined();
      expect(Array.isArray(prefs.items)).toBe(true);
    }, 15_000);

    it('should fetch user preference topic successfully', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const topicId = env('TOPIC_ID');
      const topic = await preferences.getUserPreferenceTopic({ topicId });
      expect(topic.topicId).toBe(topicId);
      expect(topic.status).toBeDefined();
      expect(topic.hasCustomRouting).toBeDefined();
      expect(Array.isArray(topic.customRouting)).toBe(true);
    }, 15_000);

    it('should update user preference topic successfully', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const topicId = env('TOPIC_ID');
      const result2 = await preferences.putUserPreferenceTopic({
        topicId,
        status: 'OPTED_IN',
        hasCustomRouting: false,
        customRouting: [],
      });
      expect(result2.topicId).toBe(topicId);
      expect(result2.status).toBeDefined();
      expect(result2.hasCustomRouting).toBeDefined();
      expect(Array.isArray(result2.customRouting)).toBe(true);
    }, 15_000);

    it('should update digest schedule for a topic', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const topicId = env('TOPIC_ID');
      const digestScheduleId = env('DIGEST_SCHEDULE_ID');
      const result2 = await preferences.putUserPreferenceTopic({
        topicId,
        status: 'OPTED_IN',
        hasCustomRouting: false,
        customRouting: [],
        digestSchedule: digestScheduleId,
      });
      expect(result2.topicId).toBe(topicId);
      expect(result2.digestSchedule).toBe(digestScheduleId);
    }, 15_000);

    it('should ignore an invalid digest schedule id', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const topicId = env('TOPIC_ID');
      const invalidId = 'invalid-digest-id-12345';
      const result2 = await preferences.putUserPreferenceTopic({
        topicId,
        status: 'OPTED_IN',
        hasCustomRouting: false,
        customRouting: [],
        digestSchedule: invalidId,
      });
      expect(result2.topicId).toBe(topicId);
      expect(result2.digestSchedule).not.toBe(invalidId);
    }, 15_000);

    it('should fetch digest schedules for a topic', async () => {
      const { result } = renderCourierHook();

      act(() => {
        const { auth } = result.current;
        auth.signIn(getSignInProps());
      });
      await waitFor(() => {
        const { shared } = result.current;
        expect(shared.client).toBeDefined();
      });

      const { preferences } = result.current;
      const topicId = env('TOPIC_ID');
      const schedules = await preferences.getDigestSchedules({ topicId });
      expect(Array.isArray(schedules)).toBe(true);
      for (const schedule of schedules) {
        expect(schedule.scheduleId).toBeDefined();
      }
    }, 15_000);
  });
});
