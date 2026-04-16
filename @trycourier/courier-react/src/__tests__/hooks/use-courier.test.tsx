import { renderHook, act, waitFor } from '@testing-library/react';
import { useCourier } from '@trycourier/courier-react-components';
import type { CourierProps, InboxMessage } from '@trycourier/courier-js';
import { env } from '../utils';

function getSignInProps(): CourierProps {
  return {
    userId: env('USER_ID'),
    jwt: env('JWT'),
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
    it('should fetch user preferences through the hook', async () => {
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
      expect(prefs).toBeDefined();
      expect(Array.isArray(prefs.items)).toBe(true);
    }, 15_000);

    it('should fetch a single preference topic through the hook', async () => {
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
      const allPrefs = await preferences.getUserPreferences();
      const topicId = allPrefs.items[0]?.topicId;
      expect(topicId).toBeDefined();

      const topic = await preferences.getUserPreferenceTopic({ topicId: topicId! });
      expect(topic).toBeDefined();
      expect(topic.topicId).toBe(topicId);
    }, 15_000);

    it('should update user preference topic through the hook', async () => {
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
      const topicId = (await preferences.getUserPreferences()).items[0]?.topicId;
      expect(topicId).toBeDefined();

      const updated = await preferences.putUserPreferenceTopic({
        topicId: topicId!,
        status: 'OPTED_IN',
        hasCustomRouting: false,
        customRouting: [],
      });
      expect(updated).toBeDefined();
      expect(updated.topicId).toBe(topicId);
    }, 15_000);

    it('should update digest schedule through the hook', async () => {
      const digestScheduleId = process.env.DIGEST_SCHEDULE_ID;
      if (!digestScheduleId) {
        console.warn('Skipping digest schedule hook test: DIGEST_SCHEDULE_ID not set');
        return;
      }

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
      const topicId = (await preferences.getUserPreferences()).items[0]?.topicId;
      expect(topicId).toBeDefined();

      const updated = await preferences.putUserPreferenceTopic({
        topicId: topicId!,
        status: 'OPTED_IN',
        hasCustomRouting: false,
        customRouting: [],
        digestSchedule: digestScheduleId,
      });
      expect(updated).toBeDefined();
      expect(updated.topicId).toBe(topicId);
      expect(updated.digestSchedule).toBe(digestScheduleId);
    }, 15_000);

    it('should fetch digest schedules for a topic through the hook', async () => {
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
      const allPrefs = await preferences.getUserPreferences();
      const topicId = allPrefs.items[0]?.topicId;
      expect(topicId).toBeDefined();

      const schedules = await preferences.getDigestSchedules({ topicId: topicId! });
      expect(Array.isArray(schedules)).toBe(true);
    }, 15_000);
  });
});
