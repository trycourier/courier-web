import { CourierPreferences } from "../courier-preferences";

describe("courier-preferences header", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mount(): CourierPreferences {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    return el;
  }

  function title(): HTMLElement | null {
    return document.querySelector(".courier-preferences-title");
  }

  function subtitle(): HTMLElement | null {
    return document.querySelector(".courier-preferences-subtitle");
  }

  it("renders the title and subtitle from attributes", () => {
    const el = mount();
    el.setAttribute("title", "Notifications Preferences");
    el.setAttribute("subtitle", "Choose how you'd like to be reached.");

    expect(title()?.textContent).toBe("Notifications Preferences");
    expect(subtitle()?.textContent).toBe("Choose how you'd like to be reached.");
  });

  it("omits the subtitle element when only a title is set", () => {
    const el = mount();
    el.setAttribute("title", "Just a title");

    expect(title()?.textContent).toBe("Just a title");
    expect(subtitle()).toBeNull();
  });

  it("renders no header when neither title nor subtitle is set", () => {
    mount();

    expect(document.querySelector(".courier-preferences-header")).toBeNull();
  });

  it("clears the title when the attribute is removed", () => {
    const el = mount();
    el.setAttribute("title", "Temporary");
    expect(title()?.textContent).toBe("Temporary");

    el.removeAttribute("title");
    expect(title()).toBeNull();
  });
});
