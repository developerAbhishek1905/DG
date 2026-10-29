import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Simple one-click date picker.
 *
 * A button that opens a small popover with Today / Tomorrow shortcuts and a
 * compact month grid. One click on a day picks it. Works the same in every
 * browser (no native date input).
 *
 * value / onChange use "YYYY-MM-DD", exactly like <input type="date">.
 */

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
  /** Extra classes for the trigger button (padding, text size...) */
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const toKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);

  return new Date(y, m - 1, d);
};

const formatLabel = (key: string) =>
  parseKey(key).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const POPOVER_WIDTH = 264;
const POPOVER_HEIGHT = 330;

export default function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  min,
  max,
  className = "px-3 py-2.5 text-sm",
}: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !popoverRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const close = (event: Event) => {
      if (popoverRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const openPopover = () => {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) return;

    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8),
    );

    const top =
      rect.bottom + POPOVER_HEIGHT + 8 > window.innerHeight
        ? Math.max(8, rect.top - POPOVER_HEIGHT - 4)
        : rect.bottom + 4;

    setPosition({ top, left });
    setOpen(true);
  };

  const pick = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPopover())}
        className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded-lg border border-gray-300 bg-white text-left outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:opacity-60 ${className}`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value ? formatLabel(value) : placeholder}
        </span>

        <CalendarDays size={14} className="shrink-0 text-gray-400" />
      </button>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: POPOVER_WIDTH,
          }}
          className="z-[200] rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl"
        >
          <CalendarPanel
            value={value}
            min={min}
            max={max}
            onPick={pick}
          />
        </div>
      )}
    </>
  );
}

interface CalendarPanelProps {
  value: string;
  min?: string;
  max?: string;
  onPick: (value: string) => void;
}

/* Today / Tomorrow shortcuts + compact month grid (no popover of its own) */
export function CalendarPanel({ value, min, max, onPick }: CalendarPanelProps) {
  const [viewMonth, setViewMonth] = useState(() =>
    value ? parseKey(value) : new Date(),
  );

  const isDisabledDay = (key: string) =>
    Boolean((min && key < min) || (max && key > max));

  const pick = (key: string) => {
    if (isDisabledDay(key)) return;

    onPick(key);
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayKey = toKey(new Date());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = toKey(tomorrow);

  return (
    <div>
      {/* Shortcuts */}

          <div className="mb-2 grid grid-cols-2 gap-1.5">
            {[
              { label: "Today", key: todayKey },
              { label: "Tomorrow", key: tomorrowKey },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                disabled={isDisabledDay(shortcut.key)}
                onClick={() => pick(shortcut.key)}
                className={`rounded-md py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  value === shortcut.key
                    ? "bg-[#6D28D9] text-white"
                    : "bg-blue-50 text-[#6D28D9] hover:bg-blue-100"
                }`}
              >
                {shortcut.label}
              </button>
            ))}
          </div>

          {/* Month header */}

          <div className="mb-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month - 1, 1))}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            <p className="text-xs font-semibold text-gray-800">
              {viewMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month + 1, 1))}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekdays */}

          <div className="grid grid-cols-7">
            {WEEKDAYS.map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="py-1 text-center text-[10px] font-semibold text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}

          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} />;

              const key = toKey(new Date(year, month, day));
              const selected = key === value;
              const blocked = isDisabledDay(key);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={blocked}
                  onClick={() => pick(key)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${
                    selected
                      ? "bg-[#6D28D9] font-semibold text-white"
                      : key === todayKey
                        ? "font-semibold text-[#6D28D9] ring-1 ring-[#6D28D9]/40 hover:bg-blue-50"
                        : "text-gray-700 hover:bg-blue-50"
                  } ${blocked ? "cursor-not-allowed opacity-30 hover:bg-transparent" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
    </div>
  );
}
