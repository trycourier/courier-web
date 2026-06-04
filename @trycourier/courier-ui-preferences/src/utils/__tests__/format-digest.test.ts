import { formatDigest } from "../format-digest";
import { DigestSchedule } from "../../types/preferences";

function baseSchedule(overrides: Partial<DigestSchedule> = {}): DigestSchedule {
  return {
    default: false,
    period: "",
    recurrence: "",
    repetition: "",
    scheduleId: "schedule-1",
    start: "",
    ...overrides,
  };
}

describe("format-digest", () => {
  describe("formatDigest", () => {
    it('returns "Instant" when the period is "Instant"', () => {
      expect(formatDigest(baseSchedule({ period: "Instant" }))).toBe("Instant");
    });

    it('takes precedence over an existing start when the period is "Instant"', () => {
      const schedule = baseSchedule({ period: "Instant", start: "2024-01-01T09:00:00Z", recurrence: "daily" });
      expect(formatDigest(schedule)).toBe("Instant");
    });

    describe("when there is no start time", () => {
      it("capitalizes the period and appends UTC", () => {
        expect(formatDigest(baseSchedule({ period: "daily" }))).toBe("Daily UTC");
      });

      it('returns an empty string when there is no period', () => {
        expect(formatDigest(baseSchedule())).toBe("");
      });
    });

    it('returns "Instant" for an instant recurrence with a start time', () => {
      const schedule = baseSchedule({ recurrence: "instant", start: "2024-01-01T09:00:00Z" });
      expect(formatDigest(schedule)).toBe("Instant");
    });

    describe("custom recurrence", () => {
      it("lists weekdays in calendar order regardless of input order", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          repeat: {
            frequency: 1,
            interval: "week",
            on: { friday: true, monday: true, wednesday: true },
          },
        });
        expect(formatDigest(schedule)).toBe("Every 1 week(s) on Monday, Wednesday, Friday");
      });

      it("uses a string day-of-week when `on` is a string", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          repeat: { frequency: 2, interval: "week", on: "Tuesday" },
        });
        expect(formatDigest(schedule)).toBe("Every 2 week(s) on Tuesday");
      });

      it("describes a monthly day-of-month", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          repeat: { frequency: 1, interval: "month", on: "1st" },
        });
        expect(formatDigest(schedule)).toBe("Every 1 month(s) on 1st of the month");
      });

      it("appends a numeric occurrence count from `end`", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          end: 5,
          repeat: { frequency: 1, interval: "week", on: "Monday" },
        });
        expect(formatDigest(schedule)).toBe("Every 1 week(s) on Monday (5 occurrences)");
      });

      it("appends an end date from a string `end`", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          end: "2024-12-31T00:00:00Z",
          repeat: { frequency: 1, interval: "day" },
        });
        const result = formatDigest(schedule);
        expect(result).toContain("Every 1 day(s)");
        expect(result).toContain("(until ");
      });

      it("always returns a capitalized string", () => {
        const schedule = baseSchedule({
          start: "2024-01-01T09:00:00Z",
          recurrence: "custom",
          repeat: { frequency: 1, interval: "day" },
        });
        const result = formatDigest(schedule);
        expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
      });
    });

    describe("default recurrence with a start time", () => {
      // The exact clock time is timezone-dependent (it routes through
      // Intl.DateTimeFormat in the local timezone), so assert structure only.
      it("prefixes the capitalized recurrence and includes a time", () => {
        const schedule = baseSchedule({ recurrence: "daily", start: "2024-01-01T09:00:00Z" });
        const result = formatDigest(schedule);
        expect(result.startsWith("Daily at ")).toBe(true);
        expect(result).toMatch(/at \d/);
      });
    });
  });
});
