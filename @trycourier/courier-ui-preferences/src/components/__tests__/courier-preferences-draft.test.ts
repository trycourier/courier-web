import { Courier } from "@trycourier/courier-js";
import { CourierPreferences } from "../courier-preferences";

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("courier-preferences draft attribute", () => {
  let getPreferencePage: jest.Mock;

  beforeEach(() => {
    getPreferencePage = jest.fn().mockResolvedValue(null);
    jest
      .spyOn(Courier.shared, "addAuthenticationListener")
      .mockReturnValue({ remove: jest.fn() } as any);
    jest.spyOn(Courier.shared, "client", "get").mockReturnValue({
      options: { userId: "user-1" },
      preferences: { getPreferencePage },
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mount(): CourierPreferences {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    return el;
  }

  it("requests the published page by default", async () => {
    mount();
    await flush();

    expect(getPreferencePage).toHaveBeenCalled();
    expect(getPreferencePage.mock.calls.at(-1)![0]).toMatchObject({ draft: false });
  });

  it("requests the draft page when draft='true'", async () => {
    const el = mount();
    getPreferencePage.mockClear();

    el.setAttribute("draft", "true");
    await flush();

    expect(getPreferencePage).toHaveBeenCalled();
    expect(getPreferencePage.mock.calls.at(-1)![0]).toMatchObject({ draft: true });
  });

  it("treats any non-'true' value as published", async () => {
    const el = mount();
    el.setAttribute("draft", "true");
    await flush();
    getPreferencePage.mockClear();

    el.setAttribute("draft", "false");
    await flush();

    expect(getPreferencePage.mock.calls.at(-1)![0]).toMatchObject({ draft: false });
  });
});
