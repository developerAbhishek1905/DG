/*
 * Date + time input that behaves the same in every browser.
 *
 * <input type="datetime-local"> has no time picker in Firefox and is clipped
 * on small screens, so this renders a native date input plus hour / minute /
 * AM-PM selects. The value stays in the "YYYY-MM-DDTHH:mm" format that
 * datetime-local uses, so it can replace it without touching callers.
 */

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const selectClass =
  "min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-1 py-2 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:opacity-60";

export default function DateTimeInput({
  value,
  onChange,
  disabled = false,
  className = "",
}: Props) {
  const [date = "", time = ""] = (value || "").split("T");

  const [hh, mm] = time ? time.split(":").map(Number) : [NaN, NaN];

  const hasTime = !Number.isNaN(hh);
  const isPm = hasTime && hh >= 12;
  const hour12 = hasTime ? hh % 12 || 12 : "";
  const minute = hasTime ? mm : "";

  const emit = (
    nextDate: string,
    nextHour12: number | "",
    nextMinute: number | "",
    nextPm: boolean,
  ) => {
    if (!nextDate) {
      onChange("");
      return;
    }

    const h12 = nextHour12 === "" ? 12 : nextHour12;
    const m = nextMinute === "" ? 0 : nextMinute;
    const h24 = (h12 % 12) + (nextPm ? 12 : 0);

    onChange(`${nextDate}T${pad(h24)}:${pad(m)}`);
  };

  // Keep an odd minute (e.g. 07) selectable
  const minutes =
    minute !== "" && !MINUTES.includes(minute as number)
      ? [...MINUTES, minute as number].sort((a, b) => a - b)
      : MINUTES;

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <input
        type="date"
        value={date}
        disabled={disabled}
        onChange={(e) => emit(e.target.value, hour12, minute, isPm)}
        className="block w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:opacity-60"
      />

      <div className="flex min-w-0 gap-1">
        <select
          aria-label="Hour"
          value={hour12}
          disabled={disabled || !date}
          onChange={(e) => emit(date, Number(e.target.value), minute, isPm)}
          className={selectClass}
        >
          {!hasTime && <option value="">HH</option>}
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {pad(h)}
            </option>
          ))}
        </select>

        <select
          aria-label="Minute"
          value={minute}
          disabled={disabled || !date}
          onChange={(e) => emit(date, hour12, Number(e.target.value), isPm)}
          className={selectClass}
        >
          {!hasTime && <option value="">MM</option>}
          {minutes.map((m) => (
            <option key={m} value={m}>
              {pad(m)}
            </option>
          ))}
        </select>

        <select
          aria-label="AM or PM"
          value={isPm ? "PM" : "AM"}
          disabled={disabled || !date}
          onChange={(e) =>
            emit(date, hour12, minute, e.target.value === "PM")
          }
          className={selectClass}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
