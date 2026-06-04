import { CourierDigestScheduleOption } from "@trycourier/courier-js";
import { defaultLightTheme } from "../../types/courier-preferences-theme";
import { CourierPreferencesThemeManager } from "../../types/courier-preferences-theme-manager";
import { CourierDigestSchedule } from "../courier-digest-schedule";

const THEME_MANAGER = new CourierPreferencesThemeManager(defaultLightTheme);

const SCHEDULES: CourierDigestScheduleOption[] = [
  { scheduleId: "daily", period: "daily", default: true },
  { scheduleId: "weekly", period: "weekly" },
];

describe("courier-digest-schedule", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mountSchedule(configure?: (schedule: CourierDigestSchedule) => void): CourierDigestSchedule {
    const schedule = new CourierDigestSchedule();
    schedule.themeManager = THEME_MANAGER;
    configure?.(schedule);
    document.body.appendChild(schedule);
    return schedule;
  }

  function options(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll<HTMLButtonElement>(".courier-digest-option"));
  }

  it("renders a radio option per schedule with formatted labels", () => {
    mountSchedule((s) => { s.schedules = SCHEDULES; });

    const labels = options().map((o) => o.textContent);
    expect(options()).toHaveLength(2);
    expect(labels[0]).toContain("Daily UTC");
    expect(labels[1]).toContain("Weekly UTC");
  });

  it("renders a single non-interactive label when there is one schedule", () => {
    mountSchedule((s) => { s.schedules = [SCHEDULES[0]]; });

    expect(options()).toHaveLength(0);
    const label = document.querySelector(".courier-digest-label");
    expect(label?.textContent).toContain("Daily UTC");
  });

  it("selects the default schedule when none is explicitly selected", () => {
    mountSchedule((s) => { s.schedules = SCHEDULES; });

    const [daily, weekly] = options();
    expect(daily.getAttribute("aria-checked")).toBe("true");
    expect(weekly.getAttribute("aria-checked")).toBe("false");
  });

  it("changes selection on click and fires onScheduleChange", () => {
    const handler = jest.fn();
    mountSchedule((s) => {
      s.schedules = SCHEDULES;
      s.onScheduleChange = handler;
    });

    const [, weekly] = options();
    weekly.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("weekly");
    expect(weekly.getAttribute("aria-checked")).toBe("true");
  });

  it("does not re-fire onScheduleChange when the selected option is clicked again", () => {
    const handler = jest.fn();
    mountSchedule((s) => {
      s.schedules = SCHEDULES;
      s.selectedScheduleId = "weekly";
      s.onScheduleChange = handler;
    });

    const [, weekly] = options();
    weekly.click();

    expect(handler).not.toHaveBeenCalled();
  });
});
