import { CourierPreferenceToggle } from "../courier-preference-toggle";

describe("courier-preference-toggle", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mountToggle(configure?: (toggle: CourierPreferenceToggle) => void): CourierPreferenceToggle {
    const toggle = new CourierPreferenceToggle();
    configure?.(toggle);
    document.body.appendChild(toggle);
    return toggle;
  }

  describe("onComponentMounted", () => {
    it("renders a button with a thumb", () => {
      mountToggle();

      const button = document.querySelector(".courier-pref-toggle");
      expect(button).not.toBeNull();
      expect(button?.tagName).toBe("BUTTON");
      expect(document.querySelector(".courier-pref-toggle-thumb")).not.toBeNull();
    });

    it('defaults to aria-checked="false"', () => {
      mountToggle();
      expect(document.querySelector(".courier-pref-toggle")?.getAttribute("aria-checked")).toBe("false");
    });

    it('reflects an initial checked value as aria-checked="true"', () => {
      mountToggle((toggle) => { toggle.checked = true; });
      expect(document.querySelector(".courier-pref-toggle")?.getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("click", () => {
    it("toggles the checked state and fires onChange with the new value", () => {
      const handler = jest.fn();
      const toggle = mountToggle((t) => { t.onChange = handler; });
      const button = document.querySelector<HTMLButtonElement>(".courier-pref-toggle")!;

      button.click();

      expect(toggle.checked).toBe(true);
      expect(button.getAttribute("aria-checked")).toBe("true");
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(true);

      button.click();

      expect(toggle.checked).toBe(false);
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler).toHaveBeenLastCalledWith(false);
    });

    it("does not toggle or fire onChange when disabled", () => {
      const handler = jest.fn();
      const toggle = mountToggle((t) => {
        t.onChange = handler;
        t.disabled = true;
      });
      const button = document.querySelector<HTMLButtonElement>(".courier-pref-toggle")!;

      expect(button.getAttribute("aria-disabled")).toBe("true");

      button.click();

      expect(toggle.checked).toBe(false);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("track color", () => {
    it("uses a different track color when checked vs unchecked", () => {
      const toggle = mountToggle((t) => { t.primaryColor = "rgb(1, 2, 3)"; });
      const button = document.querySelector<HTMLButtonElement>(".courier-pref-toggle")!;

      const uncheckedColor = button.style.backgroundColor;
      toggle.checked = true;
      const checkedColor = button.style.backgroundColor;

      expect(checkedColor).not.toBe(uncheckedColor);
      expect(checkedColor).toBe("rgb(1, 2, 3)");
    });
  });
});
