import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { h } from "vue";
// Import from the package entry so the web component is registered (the entry's
// value re-exports from courier-ui-inbox trigger registerElement), mirroring how
// consumers import the SDK.
import { CourierInbox } from "../index";
import type { CourierInbox as CourierInboxElement } from "@trycourier/courier-ui-inbox";

// Wait for onMounted + queueMicrotask readiness, then any pending render work.
async function settle() {
  await flushPromises();
  await new Promise((resolve) => queueMicrotask(() => resolve(null)));
  await flushPromises();
}

describe("CourierInbox", () => {
  it("renders the underlying <courier-inbox> custom element", async () => {
    const wrapper = mount(CourierInbox, { attachTo: document.body });
    await settle();

    expect(wrapper.find("courier-inbox").exists()).toBe(true);

    wrapper.unmount();
  });

  it("syncs props onto the element as attributes", async () => {
    const wrapper = mount(CourierInbox, {
      attachTo: document.body,
      props: { height: "400px", mode: "dark" },
    });
    await settle();

    const el = wrapper.find("courier-inbox").element;
    expect(el.getAttribute("height")).toBe("400px");
    expect(el.getAttribute("mode")).toBe("dark");

    wrapper.unmount();
  });

  it("exposes the underlying element via getElement()", async () => {
    const wrapper = mount(CourierInbox, { attachTo: document.body });
    await settle();

    const el = (wrapper.vm as unknown as { getElement: () => CourierInboxElement | null }).getElement();
    expect(el).toBeTruthy();
    expect(typeof el?.onMessageClick).toBe("function");

    wrapper.unmount();
  });

  it("renders a custom header via the render bridge and wires its events", async () => {
    let clicked = false;
    const wrapper = mount(CourierInbox, {
      attachTo: document.body,
      props: {
        renderHeader: () =>
          h("div", { id: "my-header", onClick: () => (clicked = true) }, "Custom Header"),
      },
    });
    await settle();

    const header = document.querySelector("#my-header") as HTMLElement | null;
    expect(header).toBeTruthy();
    expect(header?.textContent).toBe("Custom Header");

    header?.click();
    expect(clicked).toBe(true);

    wrapper.unmount();
  });
});
