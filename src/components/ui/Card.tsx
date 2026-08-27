import type { HTMLAttributes } from "react";

export default function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}