import Card from "../../../components/ui/Card";

interface Props {
  total: number;
  used: number;
}

export default function DealerCapacityCard({ total, used }: Props) {
  const available = Math.max(total - used, 0);
  const percentage =
    total > 0 ? Math.min(Math.round((used / total) * 100), 100) : 0;

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-gray-900">Dealer Capacity</h3>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {used}
              <span className="text-lg font-medium text-gray-400">
                /{total}
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-500">Active complaint load</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-green-600">{available}</p>

            <p className="text-xs text-gray-500">Available</p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#123B7A]"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          {percentage}% capacity used
        </p>
      </div>
    </Card>
  );
}