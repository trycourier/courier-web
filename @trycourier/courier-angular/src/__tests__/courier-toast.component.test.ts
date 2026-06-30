// Bare import for its side effect: registers the <courier-toast> custom element.
import "@trycourier/courier-ui-toast";
import {
  CourierToast as CourierToastElement,
  type CourierToastItemClickEvent,
} from "@trycourier/courier-ui-toast";
import { CourierToastComponent } from "../components/courier-toast.component";
import { createComponent, createFakeViewContainerRef, tick, type FakeEmbeddedView } from "./component-harness";

// Importing CourierToastElement registers the <courier-toast> custom element, so
// document.createElement returns a real, upgraded instance to host the component.

describe("CourierToastComponent", () => {
  let el: CourierToastElement;

  beforeEach(() => {
    el = document.createElement("courier-toast") as CourierToastElement;
    document.body.appendChild(el);
    // Stub the element's event-registration API so the component wiring is
    // exercised without depending on the element's internal behavior.
    jest.spyOn(el, "onToastItemClick").mockImplementation(() => {});
    jest.spyOn(el, "onToastItemActionClick").mockImplementation(() => {});
  });

  afterEach(() => {
    el.remove();
    jest.restoreAllMocks();
  });

  describe("attributes", () => {
    it("syncs inputs onto the host element after view init", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierToastComponent, el, viewContainerRef);
      component.mode = "dark";
      component.autoDismiss = true;
      component.autoDismissTimeoutMs = 4000;
      component.dismissButton = "visible";

      component.ngAfterViewInit();
      await tick();

      expect(el.getAttribute("mode")).toBe("dark");
      expect(el.getAttribute("auto-dismiss")).toBe("true");
      expect(el.getAttribute("auto-dismiss-timeout-ms")).toBe("4000");
      expect(el.getAttribute("dismiss-button")).toBe("visible");
    });

    it("re-syncs attributes on ngOnChanges once ready", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierToastComponent, el, viewContainerRef);
      component.ngAfterViewInit();
      await tick();

      component.mode = "light";
      component.ngOnChanges();

      expect(el.getAttribute("mode")).toBe("light");
    });
  });

  describe("readiness", () => {
    it("emits ready$ exactly once after registering handlers", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierToastComponent, el, viewContainerRef);

      const ready: boolean[] = [];
      component.ready$.subscribe((value) => ready.push(value));

      component.ngAfterViewInit();
      await tick();

      expect(ready).toEqual([true]);
    });
  });

  describe("events", () => {
    it("emits toastItemClick when the element invokes its registered handler", async () => {
      const { viewContainerRef } = createFakeViewContainerRef();
      const component = createComponent(CourierToastComponent, el, viewContainerRef);

      const emitted: CourierToastItemClickEvent[] = [];
      component.toastItemClick.subscribe((props) => emitted.push(props));

      component.ngAfterViewInit();
      await tick();

      const onToastItemClick = el.onToastItemClick as jest.Mock;
      expect(onToastItemClick).toHaveBeenCalledTimes(1);
      const registered = onToastItemClick.mock.calls[0][0];
      const fakeEvent = { message: { messageId: "m1" } } as CourierToastItemClickEvent;
      registered(fakeEvent);

      expect(emitted).toEqual([fakeEvent]);
    });
  });

  describe("custom render slots", () => {
    it("bridges a toast content template to the element and tracks the view for teardown", async () => {
      const clickHandler = jest.fn();
      const setToastItemContent = jest.spyOn(el, "setToastItemContent").mockImplementation(() => {});
      const { viewContainerRef, views } = createFakeViewContainerRef(() => {
        const node = document.createElement("div");
        node.id = "my-toast-content";
        node.textContent = "Custom Content";
        node.addEventListener("click", clickHandler);
        return [node];
      });

      const component = createComponent(CourierToastComponent, el, viewContainerRef);
      // Simulate Angular projecting `<ng-template #toastItemContent>` into the @ContentChild.
      component.toastItemContentTpl = {} as never;

      component.ngAfterViewInit();
      await tick();

      expect(setToastItemContent).toHaveBeenCalledTimes(1);

      const factory = setToastItemContent.mock.calls[0][0] as (props: unknown) => HTMLElement;
      const rendered = factory(null);
      const content = rendered.querySelector("#my-toast-content") as HTMLElement | null;

      expect(content).toBeTruthy();
      expect(content?.textContent).toBe("Custom Content");

      content?.click();
      expect(clickHandler).toHaveBeenCalled();

      component.ngOnDestroy();
      expect((views[0] as FakeEmbeddedView).destroy).toHaveBeenCalled();
    });
  });
});
