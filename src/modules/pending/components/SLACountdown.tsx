import {
  AlertTriangle,
  Clock3,
} from "lucide-react";

import {
  useSLACountdown,
} from "../hooks/useSLACountdown";

interface Props {
  deadline: string;
}

export default function SLACountdown({
  deadline,
}: Props) {
  const countdown =
    useSLACountdown(
      deadline
    );

  if (
    countdown.expired
  ) {
    return (
      <div className="inline-flex items-center gap-2 font-medium text-red-600">
        <AlertTriangle
          size={16}
        />

        SLA Breached
      </div>
    );
  }

  const warning =
    countdown.totalMilliseconds <=
    2 * 60 * 60 * 1000;

  return (
    <div
      className={`inline-flex items-center gap-2 ${
        warning
          ? "text-amber-600"
          : "text-gray-700"
      }`}
    >
      <Clock3
        size={15}
      />

      <span className="font-mono text-sm font-semibold">
        {countdown.days >
          0 &&
          `${countdown.days}d `}

        {String(
          countdown.hours
        ).padStart(2, "0")}
        :

        {String(
          countdown.minutes
        ).padStart(2, "0")}
        :

        {String(
          countdown.seconds
        ).padStart(2, "0")}
      </span>
    </div>
  );
}