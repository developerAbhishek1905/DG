import StatusBadge, { type StatusTone } from "./StatusBadge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "suspended";
}

// Generic badge: same look and tones as StatusBadge
export default function Badge({ children, variant = "neutral" }: BadgeProps) {
  const tone: StatusTone = variant === "suspended" ? "accent" : variant;

  return <StatusBadge tone={tone} label={children} />;
}
