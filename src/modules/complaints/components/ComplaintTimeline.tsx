import Card from "../../../components/ui/Card";

import type {
  ComplaintTimelineItem,
} from "../types/complaint.types";

interface Props {
  timeline: ComplaintTimelineItem[];
}

export default function ComplaintTimeline({
  timeline,
}: Props) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900">
        Complaint Timeline
      </h3>

      <div className="mt-5 space-y-6">
        {timeline.map((item, index) => (
          <div
            key={item.id}
            className="relative flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-[#123B7A]" />

              {index !== timeline.length - 1 && (
                <div className="mt-1 h-full w-px bg-gray-200" />
              )}
            </div>

            <div className="pb-2">
              <p className="text-sm font-semibold text-gray-900">
                {item.title}
              </p>

              {item.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {item.description}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-400">
                {new Date(
                  item.timestamp
                ).toLocaleString()}
                {item.user &&
                  ` • ${item.user}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}