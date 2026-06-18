import type { Subscription } from "rxjs";
import type { CourierProps, InboxMessage } from "@trycourier/courier-js";
import {
  CourierService,
  type CourierAuthState,
  type CourierInboxState,
  type CourierToastState,
} from "../services/courier.service";
import { env, waitFor } from "./utils";

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

describe("CourierService (E2E)", () => {
  let service: CourierService;
  let subscriptions: Subscription[];

  // Latest emitted state from each stream — the Angular analog of React's
  // `result.current`. BehaviorSubjects emit synchronously on subscribe, so
  // these are populated immediately and updated as the datastores change.
  let auth: CourierAuthState;
  let inbox: CourierInboxState;
  let toast: CourierToastState;

  beforeEach(() => {
    // The service has no injected dependencies, so we instantiate it directly
    // rather than going through Angular's TestBed/DI.
    service = new CourierService();
    subscriptions = [
      service.auth$.subscribe((state) => (auth = state)),
      service.inbox$.subscribe((state) => (inbox = state)),
      service.toast$.subscribe((state) => (toast = state)),
    ];
  });

  afterEach(() => {
    service.signOut();
    subscriptions.forEach((sub) => sub.unsubscribe());
    service.ngOnDestroy();
  });

  describe("auth", () => {
    it("should sign in and expose userId", async () => {
      service.signIn(getSignInProps());

      await waitFor(() => {
        expect(auth.userId).toBe(env("USER_ID"));
      });
      expect(service.shared.client).toBeDefined();
    });

    it("should sign out and clear userId", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(auth.userId).toBe(env("USER_ID"));
      });

      service.signOut();
      await waitFor(() => {
        expect(auth.userId).toBeUndefined();
      });
      expect(service.shared.client).toBeUndefined();
    });
  });

  describe("inbox", () => {
    it("should load inbox without error", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(auth.userId).toBeDefined();
      });

      await service.load();

      expect(inbox.error).toBeUndefined();
      expect(inbox.feeds).toBeDefined();
    }, 15_000);
  });

  describe("toast", () => {
    it("should add and remove a message without error", async () => {
      const fakeMessage = { messageId: "e2e-toast-test" } as InboxMessage;

      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(auth.userId).toBeDefined();
      });

      expect(() => service.addToastMessage(fakeMessage)).not.toThrow();
      expect(() => service.removeToastMessage(fakeMessage)).not.toThrow();

      expect(toast.error).toBeUndefined();
    });
  });

  describe("listeners", () => {
    it("should fire auth listener on sign in and sign out", async () => {
      const spy = jest.fn();
      const listener = service.shared.addAuthenticationListener(spy);

      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: env("USER_ID") });
      });

      service.signOut();
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith({ userId: undefined });
      });

      listener.remove();
    });

    it("should stop emitting after ngOnDestroy removes listeners", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(auth.userId).toBe(env("USER_ID"));
      });

      service.ngOnDestroy();

      // After teardown the auth listener is removed, so a subsequent sign-out
      // no longer pushes a new auth state to subscribers.
      const userIdBeforeSignOut = auth.userId;
      service.signOut();
      expect(auth.userId).toBe(userIdBeforeSignOut);
    });
  });

  describe("preferences", () => {
    it("should fetch user preferences successfully", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(service.shared.client).toBeDefined();
      });

      const prefs = await service.getUserPreferences();
      expect(prefs.paging.more).toBeDefined();
      expect(Array.isArray(prefs.items)).toBe(true);
    }, 15_000);

    it("should fetch user preference topic successfully", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(service.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const topic = await service.getUserPreferenceTopic({ topicId });
      expect(topic.topicId).toBe(topicId);
      expect(topic.status).toBeDefined();
      expect(topic.hasCustomRouting).toBeDefined();
      expect(Array.isArray(topic.customRouting)).toBe(true);
    }, 15_000);

    it("should update user preference topic successfully", async () => {
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(service.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const updated = await service.putUserPreferenceTopic({
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
      service.signIn(getSignInProps());
      await waitFor(() => {
        expect(service.shared.client).toBeDefined();
      });

      const topicId = env("TOPIC_ID");
      const schedules = await service.getDigestSchedules({ topicId });
      expect(Array.isArray(schedules)).toBe(true);
      for (const schedule of schedules) {
        expect(schedule.scheduleId).toBeDefined();
      }
    }, 15_000);
  });
});
