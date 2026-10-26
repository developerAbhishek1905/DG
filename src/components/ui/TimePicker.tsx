import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

/*
 * One-click time picker.
 *
 * Replaces <input type="time"> (separate hour / minute / AM-PM boxes) with a
 * button that opens a small grid of ready-made slots. Every slot is visible
 * at once - no scrolling - and one click picks it.
 *
 * value / onChange use "HH:mm" (24h), exactly like <input type="time">.
 */

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Extra classes for the trigger button (padding, text size...) */
  className?: string;
  /** First / last slot, in hours (defaults 8 AM - 9:30 PM) */
  startHour?: number;
  endHour?: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const formatTimeLabel = (time: string) => {
  if (!time) return "";

  const [h, m] = time.split(":").map(Number);

  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const shortLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);

  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const POPOVER_WIDTH = 264;
const POPOVER_HEIGHT = 280;

export default function TimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select time",
  className = "px-3 py-2.5 text-sm",
  startHour = 8,
  endHour = 21,
}: Props) {
  const current = value ? value.slice(0, 5) : "";

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
      // ignore scrolling inside the popover itself
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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPopover())}
        className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded-lg border border-gray-300 bg-white text-left outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:opacity-60 ${className}`}
      >
        <span className={current ? "text-gray-800" : "text-gray-400"}>
          {current ? formatTimeLabel(current) : placeholder}
        </span>

        <Clock size={14} className="shrink-0 text-gray-400" />
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
          className="z-[200] rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
        >
          <TimeSlotGrid
            value={current}
            startHour={startHour}
            endHour={endHour}
            onPick={(slot) => {
              onChange(slot);
              setOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
}

interface TimeSlotGridProps {
  value: string;
  onPick: (value: string) => void;
  startHour?: number;
  endHour?: number;
}

/* Grid of 30-minute slots (no popover of its own) */
export function TimeSlotGrid({
  value,
  onPick,
  startHour = 8,
  endHour = 21,
}: TimeSlotGridProps) {
  const slots: string[] = [];

  for (let minutes = startHour * 60; minutes <= endHour * 60 + 30; minutes += 30) {
    slots.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
  }

  return (
    <div className="grid grid-cols-4 gap-1">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onPick(slot)}
          className={`rounded-md px-1 py-1.5 text-[11px] font-medium transition ${
            slot === value
              ? "bg-[#123B7A] text-white"
              : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-[#123B7A]"
          }`}
        >
          {shortLabel(slot)}
        </button>
      ))}
    </div>
  );
}
