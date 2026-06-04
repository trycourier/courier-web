import {
  CourierPreferencesTheme,
  defaultDarkTheme,
  defaultLightTheme,
  mergeTheme,
} from "../courier-preferences-theme";

describe("courier-preferences-theme", () => {
  describe("mergeTheme", () => {
    // mergeTheme always materializes some nested objects (e.g. empty `font`
    // placeholders) that the bare defaults omit, so it is a superset of the
    // defaults rather than strictly equal — assert containment.
    it("returns the light defaults when given an empty light theme", () => {
      expect(mergeTheme("light", {})).toMatchObject(defaultLightTheme);
    });

    it("returns the dark defaults when given an empty dark theme", () => {
      expect(mergeTheme("dark", {})).toMatchObject(defaultDarkTheme);
    });

    it("lets an explicit primaryColor override the default", () => {
      const merged = mergeTheme("light", { primaryColor: "#ff0000" });
      expect(merged.primaryColor).toBe("#ff0000");
    });

    it("falls back to the default primaryColor when not provided", () => {
      const merged = mergeTheme("light", {});
      expect(merged.primaryColor).toBe(defaultLightTheme.primaryColor);
    });

    it("deep-merges nested overrides while preserving sibling defaults", () => {
      const overrides: CourierPreferencesTheme = {
        topic: {
          toggle: { trackActiveColor: "#123456" },
        },
      };
      const merged = mergeTheme("light", overrides);

      // Overridden value wins.
      expect(merged.topic?.toggle?.trackActiveColor).toBe("#123456");
      // Sibling values within the same nested object are preserved.
      expect(merged.topic?.toggle?.thumbColor).toBe(defaultLightTheme.topic?.toggle?.thumbColor);
      expect(merged.topic?.toggle?.trackColor).toBe(defaultLightTheme.topic?.toggle?.trackColor);
      // Sibling objects within `topic` are preserved.
      expect(merged.topic?.title).toEqual(defaultLightTheme.topic?.title);
    });

    it("deep-merges three levels down (digest.radio.font) without dropping defaults", () => {
      const overrides: CourierPreferencesTheme = {
        digest: {
          radio: { font: { color: "#abcdef" } },
        },
      };
      const merged = mergeTheme("light", overrides);

      expect(merged.digest?.radio?.font?.color).toBe("#abcdef");
      // The default radio ring/checked colors survive the partial font override.
      expect(merged.digest?.radio?.ringColor).toBe(defaultLightTheme.digest?.radio?.ringColor);
      expect(merged.digest?.radio?.checkedColor).toBe(defaultLightTheme.digest?.radio?.checkedColor);
      // Sibling digest fonts survive.
      expect(merged.digest?.font).toEqual(defaultLightTheme.digest?.font);
    });

    it("does not mutate the provided overrides or the defaults", () => {
      const overrides: CourierPreferencesTheme = { title: { size: "40px" } };
      const before = JSON.stringify(defaultLightTheme);

      mergeTheme("light", overrides);

      expect(overrides).toEqual({ title: { size: "40px" } });
      expect(JSON.stringify(defaultLightTheme)).toBe(before);
    });
  });
});
