import {
  useEffect,
  useState,
} from "react";

interface Countdown {
  days: number;

  hours: number;

  minutes: number;

  seconds: number;

  expired: boolean;

  totalMilliseconds: number;
}

function calculateCountdown(
  deadline: string
): Countdown {
  const now =
    Date.now();

  const end =
    new Date(
      deadline
    ).getTime();

  const difference =
    end - now;

  if (
    difference <= 0
  ) {
    return {
      days: 0,

      hours: 0,

      minutes: 0,

      seconds: 0,

      expired: true,

      totalMilliseconds: 0,
    };
  }

  const days =
    Math.floor(
      difference /
        (1000 *
          60 *
          60 *
          24)
    );

  const hours =
    Math.floor(
      (difference /
        (1000 *
          60 *
          60)) %
        24
    );

  const minutes =
    Math.floor(
      (difference /
        (1000 * 60)) %
        60
    );

  const seconds =
    Math.floor(
      (difference /
        1000) %
        60
    );

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
    totalMilliseconds:
      difference,
  };
}

export function useSLACountdown(
  deadline: string
) {
  const [
    countdown,
    setCountdown,
  ] =
    useState<Countdown>(() =>
      calculateCountdown(
        deadline
      )
    );

  useEffect(() => {
    setCountdown(
      calculateCountdown(
        deadline
      )
    );

    const interval =
      window.setInterval(
        () => {
          setCountdown(
            calculateCountdown(
              deadline
            )
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [deadline]);

  return countdown;
}