import {
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

interface Props {
  reasons: string[];
  eligible?: boolean;
}

export default function AllocationReason({
  reasons,
  eligible = true,
}: Props) {
  if (!reasons.length) {
    return (
      <p className="text-sm text-gray-500">
        No allocation reasons available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {reasons.map((reason) => (
        <div
          key={reason}
          className="flex items-start gap-2"
        >
          {eligible ? (
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-green-600"
            />
          ) : (
            <CircleAlert
              size={16}
              className="mt-0.5 shrink-0 text-amber-500"
            />
          )}

          <p className="text-sm text-gray-600">
            {reason}
          </p>
        </div>
      ))}
    </div>
  );
}