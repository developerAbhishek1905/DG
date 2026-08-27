interface Props {
  count: number;
}

export default function NotificationBadge({
  count,
}: Props) {
  if (count <= 0) {
    return null;
  }

  const displayCount =
    count > 99
      ? "99+"
      : count;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
      {displayCount}
    </span>
  );
}