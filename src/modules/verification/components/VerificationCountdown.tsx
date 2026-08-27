import {
  AlertTriangle,
  Clock3,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

interface Props {
  deadline: string;

  completed?: boolean;
}

interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;

  expired: boolean;

  remaining: number;
}

function calculate(
  deadline: string
): Countdown {
  const remaining =
    new Date(
      deadline
    ).getTime() -
    Date.now();

  if (
    remaining <= 0
  ) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      remaining: 0,
    };
  }

  return {
    hours: Math.floor(
      remaining /
        (1000 * 60 * 60)
    ),

    minutes: Math.floor(
      (remaining /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (remaining / 1000) %
        60
    ),

    expired: false,

    remaining,
  };
}

export default function VerificationCountdown({
  deadline,
  completed = false,
}: Props) {
  const [
    countdown,
    setCountdown,
  ] =
    useState(() =>
      calculate(deadline)
    );

  useEffect(() => {
    if (completed) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setCountdown(
            calculate(
              deadline
            )
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    deadline,
    completed,
  ]);

  if (completed) {
    return (
      <span className="text-sm font-medium text-green-600">
        Completed
      </span>
    );
  }

  if (
    countdown.expired
  ) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
        <AlertTriangle
          size={15}
        />

        SLA Breached
      </div>
    );
  }

  const warning =
    countdown.remaining <=
    2 * 60 * 60 * 1000;

  return (
    <div
      className={`flex items-center gap-2 ${
        warning
          ? "text-amber-600"
          : "text-gray-700"
      }`}
    >
      <Clock3
        size={15}
      />

      <span className="font-mono text-sm font-semibold">
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