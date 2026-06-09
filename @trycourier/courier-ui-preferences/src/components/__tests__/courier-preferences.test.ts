import { CourierPreferences } from "../courier-preferences";
import { defaultLightTheme } from "../../types/courier-preferences-theme";

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

describe("courier-preferences brand colors", () => {
  const BRAND_PRIMARY = "#ff0000";

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mountWithBrand(primary: string | undefined): CourierPreferences {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    el.setMode("light");
    // Simulate a loaded brand, then re-apply the effective themes the way
    // _refresh() does once the brand has been fetched.
    (el as unknown as { _brand: unknown })._brand = primary
      ? { settings: { colors: { primary } } }
      : undefined;
    (el as unknown as { _applyEffectiveThemes: () => void })._applyEffectiveThemes();
    return el;
  }

  function mergedTheme(el: CourierPreferences) {
    return (el as unknown as { _themeManager: { getTheme: () => any } })._themeManager.getTheme();
  }

  it("applies the brand primary to toggle, radio, and checkbox colors", () => {
    const theme = mergedTheme(mountWithBrand(BRAND_PRIMARY));

    expect(theme.primaryColor).toBe(BRAND_PRIMARY);
    expect(theme.topic?.toggle?.trackActiveColor).toBe(BRAND_PRIMARY);
    expect(theme.digest?.radio?.checkedColor).toBe(BRAND_PRIMARY);
    expect(theme.channelChip?.checkbox?.checkedColor).toBe(BRAND_PRIMARY);
  });

  it("overrides explicit theme control colors with the brand color", () => {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    el.setMode("light");
    el.setLightTheme({
      topic: { toggle: { trackActiveColor: "#00ff00" } },
      digest: { radio: { checkedColor: "#00ff00" } },
      channelChip: { checkbox: { checkedColor: "#00ff00" } },
    });

    (el as unknown as { _brand: unknown })._brand = { settings: { colors: { primary: BRAND_PRIMARY } } };
    (el as unknown as { _applyEffectiveThemes: () => void })._applyEffectiveThemes();

    const theme = mergedTheme(el);
    // Brand wins over explicit theme values for the three control slots.
    expect(theme.topic?.toggle?.trackActiveColor).toBe(BRAND_PRIMARY);
    expect(theme.digest?.radio?.checkedColor).toBe(BRAND_PRIMARY);
    expect(theme.channelChip?.checkbox?.checkedColor).toBe(BRAND_PRIMARY);
  });

  it("falls back to default control colors when there is no brand", () => {
    const theme = mergedTheme(mountWithBrand(undefined));

    // Defaults (blue) remain; nothing is forced to the brand color.
    expect(theme.topic?.toggle?.trackActiveColor).toBe(defaultLightTheme.topic?.toggle?.trackActiveColor);
    expect(theme.digest?.radio?.checkedColor).toBe(defaultLightTheme.digest?.radio?.checkedColor);
    expect(theme.channelChip?.checkbox?.checkedColor).toBe(defaultLightTheme.channelChip?.checkbox?.checkedColor);
  });
});
