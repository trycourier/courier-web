import { defaultDarkTheme, defaultLightTheme } from "../courier-toast-theme";
import { CourierColors } from "@trycourier/courier-ui-core";

describe("default toast themes", () => {
  it("light theme has a subtle border on the toast item", () => {
    expect(defaultLightTheme.item?.border).toBe(`1px solid ${CourierColors.gray[500]}`);
  });

  it("dark theme has a subtle border on the toast item", () => {
    expect(defaultDarkTheme.item?.border).toBe(`1px solid ${CourierColors.gray[400]}`);
  });

  it("borders are visible against the toast item background", () => {
    for (const theme of [defaultLightTheme, defaultDarkTheme]) {
      expect(theme.item?.border).not.toContain(theme.item?.backgroundColor as string);
    }
  });
});
