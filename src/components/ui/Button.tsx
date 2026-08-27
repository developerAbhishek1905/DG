import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#123B7A] text-white hover:bg-[#0B2854]",
    secondary:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    success:
      "bg-green-600 text-white hover:bg-green-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    warning:
      "bg-amber-500 text-white hover:bg-amber-600",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        gap-2 rounded-lg px-4 py-2
        text-sm font-medium
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}