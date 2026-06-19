// Bare import for its side effect: registers the <courier-inbox> custom element.
import "@trycourier/courier-ui-inbox";
import {
  CourierInbox as CourierInboxElement,
  type CourierInboxListItemFactoryProps,
} from "@trycourier/courier-ui-inbox";
import { CourierInboxComponent } from "../components/courier-inbox.component";
import { createComponent, createFakeViewContainerRef, tick, type FakeEmbeddedView } from "./component-harness";

// Importing CourierInboxElement registers the <courier-inbox> custom element, so
// document.createElement returns a real, upgraded instance to host the component.

describe("CourierInboxComponent", () => {
  let el: CourierInboxElement;

  beforeEach(() => {
    el = document.createElement("courier-inbox") as CourierInboxElement;
    document.body.appendChild(el);
    // Stub the element's event-registration API so the component wiring is
    // exercised without depending on the element's internal behavior.
    jest.spyOn(el, "onMessageClick").mockImplementation(() => {});
    jest.spyOn(el, "onMessageActionClick").mockImplementation(() => {});
    jest.spyOn(el, "onMessageLongPress").mockImplementation(() => {});
  });

  afterEach(() => {
    el.remove();
    jest.restoreAllMocks();
  });

  describe("attributes", () => {
    it("syncs inputs onto the host element after view init", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierInboxComponent, el, viewContainerRef);
      component.height = "400px";
      component.mode = "dark";
      component.feeds = [{ id: "inbox", title: "Inbox", filters: {} }] as never;

      component.ngAfterViewInit();
      await tick();

      expect(el.getAttribute("height")).toBe("400px");
      expect(el.getAttribute("mode")).toBe("dark");
      expect(JSON.parse(el.getAttribute("feeds")!)).toEqual([{ id: "inbox", title: "Inbox", filters: {} }]);
    });

    it("re-syncs attributes on ngOnChanges once ready", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierInboxComponent, el, viewContainerRef);
      component.ngAfterViewInit();
      await tick();

      component.mode = "light";
      component.ngOnChanges();

      expect(el.getAttribute("mode")).toBe("light");
    });

    it("does not touch the element before ngAfterViewInit (ngOnChanges no-ops while not ready)", () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierInboxComponent, el, viewContainerRef);
      component.mode = "dark";
      component.ngOnChanges();

      expect(el.hasAttribute("mode")).toBe(false);
    });
  });

  describe("events", () => {
    it("emits messageClick when the element invokes its registered handler", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierInboxComponent, el, viewContainerRef);

      const emitted: CourierInboxListItemFactoryProps[] = [];
      component.messageClick.subscribe((props) => emitted.push(props));

      component.ngAfterViewInit();
      await tick();

      // The component registers a single handler; invoking it should fan out to
      // the @Output EventEmitter.
      const onMessageClick = el.onMessageClick as jest.Mock;
      expect(onMessageClick).toHaveBeenCalledTimes(1);
      const registered = onMessageClick.mock.calls[0][0];
      const fakeProps = { message: { messageId: "m1" } } as CourierInboxListItemFactoryProps;
      registered(fakeProps);

      expect(emitted).toEqual([fakeProps]);
    });
  });

  describe("custom render slots", () => {
    it("bridges a header template to the element and tracks the view for teardown", async () => {
      const clickHandler = jest.fn();
      const setHeader = jest.spyOn(el, "setHeader").mockImplementation(() => {});
      const { viewContainerRef, views } = createFakeViewContainerRef(() => {
        const node = document.createElement("div");
        node.id = "my-header";
        node.textContent = "Custom Header";
        node.addEventListener("click", clickHandler);
        return [node];
      });

      const component = createComponent(CourierInboxComponent, el, viewContainerRef);
      // Simulate Angular projecting `<ng-template #header>` into the @ContentChild.
      component.headerTpl = {} as never;

      component.ngAfterViewInit();
      await tick();

      expect(setHeader).toHaveBeenCalledTimes(1);

      // Invoking the registered factory renders the template into a detached element.
      const factory = setHeader.mock.calls[0][0] as (props: unknown) => HTMLElement;
      const rendered = factory(null);
      const header = rendered.querySelector("#my-header") as HTMLElement | null;

      expect(header).toBeTruthy();
      expect(header?.textContent).toBe("Custom Header");

      header?.click();
      expect(clickHandler).toHaveBeenCalled();

      // The embedded view is destroyed on teardown to avoid leaks.
      component.ngOnDestroy();
      expect((views[0] as FakeEmbeddedView).destroy).toHaveBeenCalled();
    });
  });
});
