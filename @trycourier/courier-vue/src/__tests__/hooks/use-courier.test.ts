import { afterEach, describe, it, expect, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import type { CourierProps, InboxMessage } from "@trycourier/courier-js";
import { useCourier, type UseCourierResult } from "../../composables/use-courier";
import { env } from "../utils";

function getSignInProps(): CourierProps {
  return {
    userId: env("USER_ID"),
    jwt: env("JWT"),
    apiUrls: {
      courier: {
        rest: env("COURIER_REST_URL"),
        graphql: env("COURIER_GRAPHQL_URL"),
      },
      inbox: {
        graphql: env("INBOX_GRAPHQL_URL"),
        webSocket: env("INBOX_WEBSOCKET_URL"),
      },
    },
  };
}

/**
 * Mirrors React Testing Library's `renderHook`: mounts a throwaway component so
 * `useCourier`'s lifecycle hooks (onMounted/onBeforeUnmount listeners) run, and
 * returns the composable result. The result's `auth`/`inbox`/`toast` are
 * `shallowRef`s, so re-reading `.value` always reflects the latest datastore
 * state — no re-render needed.
 */
function renderCourierComposable(): { result: UseCourierResult; wrapper: VueWrapper } {
  let result!: UseCourierResult;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useCourier();
        return () => h("div");
      },
    }),
    { attachTo: document.body }
  );
  return { result, wrapper };
}

describe("useCourier (E2E)", () => {
  let wrapperLast: VueWrapper | undefined;
  let signOutLast: (() => void) | undefined;

  afterEach(() => {
    signOutLast?.();
    signOutLast = undefined;
    wrapperLast?.unmount();
    wrapperLast = undefined;
  });

  function render() {
    const rendered = renderCourierComposable();
    wrapperLast = rendered.wrapper;
    signOutLast = () => rendered.result.auth.value.signOut();
    return rendered;
  }

  describe("auth", () => {
    it("should sign in and expose userId", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());

      await vi.waitFor(() => {
        expect(result.auth.value.userId).toBe(env("USER_ID"));
      });
      expect(result.shared.client).toBeDefined();
    });

    it("should sign out and clear userId", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.auth.value.userId).toBe(env("USER_ID"));
      });

      result.auth.value.signOut();
      await vi.waitFor(() => {
        expect(result.auth.value.userId).toBeUndefined();
      });
      expect(result.shared.client).toBeUndefined();
    });
  });

  describe("inbox", () => {
    it("should load inbox without error", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.auth.value.userId).toBeDefined();
      });

      await result.inbox.value.load();

      expect(result.inbox.value.error).toBeUndefined();
      expect(result.inbox.value.feeds).toBeDefined();
    }, 15_000);
  });

  describe("toast", () => {
    it("should add and remove a message without error", async () => {
      const { result } = render();

      const fakeMessage = { messageId: "e2e-toast-test" } as InboxMessage;

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.auth.value.userId).toBeDefined();
      });

      expect(() => result.toast.value.addMessage(fakeMessage)).not.toThrow();
      expect(() => result.toast.value.removeMessage(fakeMessage)).not.toThrow();

      expect(result.toast.value.error).toBeUndefined();
    });
  });

  describe("listeners", () => {
    it("should fire auth listener on sign in and sign out", async () => {
      const { result } = render();
      const spy = vi.fn();
      const listener = result.shared.addAuthenticationListener(spy);

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: env("USER_ID") });
      });

      result.auth.value.signOut();
      await vi.waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: undefined });
      });

      listener.remove();
    });
  });

  describe("preferences", () => {
    it("should fetch user preferences successfully", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.shared.client).toBeDefined();
      });

      const prefs = await result.preferences.getUserPreferences();
      expect(prefs.paging.more).toBeDefined();
      expect(Array.isArray(prefs.items)).toBe(true);
    }, 15_000);

    it("should fetch user preference topic successfully", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const topic = await result.preferences.getUserPreferenceTopic({ topicId });
      expect(topic.topicId).toBe(topicId);
      expect(topic.status).toBeDefined();
      expect(topic.hasCustomRouting).toBeDefined();
      expect(Array.isArray(topic.customRouting)).toBe(true);
    }, 15_000);

    it("should update user preference topic successfully", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const updated = await result.preferences.putUserPreferenceTopic({
        topicId,
        status: "OPTED_IN",
        hasCustomRouting: false,
        customRouting: [],
      });
      expect(updated.topicId).toBe(topicId);
      expect(updated.status).toBeDefined();
      expect(updated.hasCustomRouting).toBeDefined();
      expect(Array.isArray(updated.customRouting)).toBe(true);
    }, 15_000);

    it("should fetch digest schedules for a topic", async () => {
      const { result } = render();

      result.auth.value.signIn(getSignInProps());
      await vi.waitFor(() => {
        expect(result.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const schedules = await result.preferences.getDigestSchedules({ topicId });
      expect(Array.isArray(schedules)).toBe(true);
      for (const schedule of schedules) {
        expect(schedule.scheduleId).toBeDefined();
      }
    }, 15_000);
  });
});
