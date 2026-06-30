import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { h } from "vue";
// Import from the package entry so the web component is registered (the entry's
// re-exports from courier-ui-toast trigger registerElement), mirroring how
// consumers import the SDK.
import { CourierToast } from "../index";
import { CourierToast as CourierToastElement } from "@trycourier/courier-ui-toast";

// Wait for onMounted + queueMicrotask readiness, then any pending render work.
async function settle() {
  await flushPromises();
  await new Promise((resolve) => queueMicrotask(() => resolve(null)));
  await flushPromises();
}

describe("CourierToast", () => {
  it("renders the underlying <courier-toast> custom element", async () => {
    const wrapper = mount(CourierToast, { attachTo: document.body });
    await settle();

    expect(wrapper.find("courier-toast").exists()).toBe(true);

    wrapper.unmount();
  });

  it("syncs props onto the element as attributes", async () => {
    const wrapper = mount(CourierToast, {
      attachTo: document.body,
      props: {
        mode: "dark",
        autoDismiss: true,
        autoDismissTimeoutMs: 4000,
        dismissButton: "visible",
      },
    });
    await settle();

    const el = wrapper.find("courier-toast").element;
    expect(el.getAttribute("mode")).toBe("dark");
    expect(el.hasAttribute("auto-dismiss")).toBe(true);
    expect(el.getAttribute("auto-dismiss-timeout-ms")).toBe("4000");
    expect(el.getAttribute("dismiss-button")).toBe("visible");

    wrapper.unmount();
  });

  it("exposes the underlying element via getElement()", async () => {
    const wrapper = mount(CourierToast, { attachTo: document.body });
    await settle();

    const el = (wrapper.vm as unknown as { getElement: () => CourierToastElement | null }).getElement();
    expect(el).toBeTruthy();
    expect(typeof el?.setToastItem).toBe("function");

    wrapper.unmount();
  });

  it("registers custom toast content via the render bridge and signals readiness once", async () => {
    const setToastItemContentSpy = vi.spyOn(CourierToastElement.prototype, "setToastItemContent");
    const onReady = vi.fn();

    const wrapper = mount(CourierToast, {
      attachTo: document.body,
      props: {
        onReady,
        renderToastItemContent: () => h("div", { id: "my-toast-content" }, "Custom Content"),
      },
    });
    await settle();

    // The render prop is bridged through to the element's content factory exactly
    // once, and readiness is signalled a single time (no duplicate registrations).
    expect(setToastItemContentSpy).toHaveBeenCalledTimes(1);
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onReady).toHaveBeenCalledWith(true);

    setToastItemContentSpy.mockRestore();
    wrapper.unmount();
  });
});
