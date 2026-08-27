import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  Percent,
  Users,
} from "lucide-react";

import Card from "../../../components/ui/Card";

export default function AllocationRulesCard() {
  const rules = [
    {
      icon: MapPin,
      title: "City Match",
      description:
        "Dealer must operate in the complaint city.",
    },

    {
      icon: PackageCheck,
      title: "Product Support",
      description:
        "Dealer must support the complaint product.",
    },

    {
      icon: Users,
      title: "Available Capacity",
      description:
        "Dealer must have at least one available complaint slot.",
    },

    {
      icon: Percent,
      title: "Cancellation Rate",
      description:
        "Among eligible dealers, lower cancellation percentage gets preference.",
    },
  ];

  return (
    <Card className="p-5">
      <div>
        <h3 className="font-semibold text-gray-900">
          Allocation Rules
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Dealers are shortlisted in this order.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {rules.map(
          (rule, index) => {
            const Icon = rule.icon;

            return (
              <div
                key={rule.title}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                  <Icon size={17} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">
                      {index + 1}
                    </span>

                    <p className="text-sm font-semibold text-gray-900">
                      {rule.title}
                    </p>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg bg-green-50 p-3">
        <CheckCircle2
          size={16}
          className="mt-0.5 text-green-600"
        />

        <p className="text-xs leading-5 text-green-700">
          Reassignment is manual and should be performed only by an authorized DG Team user.
        </p>
      </div>
    </Card>
  );
}