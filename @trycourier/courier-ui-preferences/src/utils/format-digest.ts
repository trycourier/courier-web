import { DigestSchedule } from "../types/preferences";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTimeBrowserTimezone(utcDateStr: string): string {
  const date = new Date(utcDateStr);
  const hoursUTC = date.getUTCHours();
  const minutesUTC = date.getUTCMinutes();

  const today = new Date();
  const simulated = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hoursUTC,
      minutesUTC
    )
  );

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: undefined,
  }).format(simulated);
}

const WEEKDAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

function getWeekdaysString(repeatOn: Record<string, boolean>): string {
  const selected = new Set<string>();
  for (const key of Object.keys(repeatOn)) {
    if (repeatOn[key]) selected.add(key.toLowerCase());
  }
  return WEEKDAY_ORDER.filter((day) => selected.has(day))
    .map((day) => capitalize(day))
    .join(", ");
}

function getScheduleString(schedule: DigestSchedule): string {
  if (schedule.recurrence === "custom" && schedule.repeat) {
    const { frequency, interval, on } = schedule.repeat;
    let str = `Every ${frequency} ${interval}(s)`;

    if (interval === "week" && on && typeof on === "object") {
      str += ` on ${getWeekdaysString(on as Record<string, boolean>)}`;
    } else if (interval === "week" && on && typeof on === "string") {
      str += ` on ${on}`;
    } else if (interval === "month" && on) {
      str += ` on ${on} of the month`;
    }

    if (schedule.end) {
      str +=
        typeof schedule.end === "number"
          ? ` (${schedule.end} occurrences)`
          : ` (until ${new Date(schedule.end).toLocaleDateString()})`;
    }

    return str;
  }

  if (schedule.recurrence === "instant") {
    return "Instant";
  }

  const time = formatTimeBrowserTimezone(schedule.start);
  return `${schedule.recurrence} at ${time}`;
}

/**
 * Format a digest schedule into a human-readable string.
 * @public
 */
export function formatDigest(schedule: DigestSchedule): string {
  if (schedule.period === "Instant") return "Instant";

  if (!schedule.start) {
    if (!schedule.period) return "";
    return capitalize(schedule.period) + " UTC";
  }

  return capitalize(getScheduleString(schedule));
}
