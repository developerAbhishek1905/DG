import { useEffect, useState } from "react";

/*
 * Date + time as TWO separate native inputs (type="date" and type="time").
 *
 * Works reliably on Android / mobile browsers, which open their own native
 * date and time pickers. The value stays in the "YYYY-MM-DDTHH:mm" format
 * that datetime-local uses. The combined value is only emitted once BOTH
 * date and time are filled in (until then it is ""), so a half-filled
 * follow-up is never saved.
 */

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const inputClass =
  "block w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:opacity-60";

const split = (value: string) => {
  const [date = "", time = ""] = (value || "").split("T");

  return { date, time: time.slice(0, 5) };
};

export default function DateAndTimeFields({
  value,
  onChange,
  disabled = false,
  className = "",
}: Props) {
  const [date, setDate] = useState(split(value).date);
  const [time, setTime] = useState(split(value).time);

  // Follow the parent when it sets / clears a full value (reset, reload...)
  useEffect(() => {
    const next = split(value);

    if (value || (!date && !time)) {
      setDate(next.date);
      setTime(next.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (nextDate: string, nextTime: string) => {
    onChange(nextDate && nextTime ? `${nextDate}T${nextTime}` : "");
  };

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <input
        type="date"
        aria-label="Follow-up date"
        value={date}
        disabled={disabled}
        onChange={(e) => {
          setDate(e.target.value);
          emit(e.target.value, time);
        }}
        className={inputClass}
      />

      <input
        type="time"
        aria-label="Follow-up time"
        value={time}
        disabled={disabled}
        onChange={(e) => {
          setTime(e.target.value);
          emit(date, e.target.value);
        }}
        className={inputClass}
      />
    </div>
  );
}
