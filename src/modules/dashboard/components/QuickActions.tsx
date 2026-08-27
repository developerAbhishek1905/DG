import {
  BadgeCheck,
  CreditCard,
  PlusCircle,
  UserRoundSearch,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function QuickActions() {
  const navigate =
    useNavigate();

  const actions = [
    {
      label:
        "Create Complaint",

      description:
        "Register a new complaint.",

      icon:
        PlusCircle,

      path:
        "/complaints/create",
    },

    {
      label:
        "Dealer Allocation",

      description:
        "Review dealer allocation.",

      icon:
        UserRoundSearch,

      path:
        "/allocation",
    },

    {
      label:
        "Verification Queue",

      description:
        "Review submitted closures.",

      icon:
        BadgeCheck,

      path:
        "/verification",
    },

    {
      label:
        "Record Payment",

      description:
        "Record dealer payment.",

      icon:
        CreditCard,

      path:
        "/payments/record",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Quick Actions
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Common operational actions.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map(
          (action) => {
            const Icon =
              action.icon;

            return (
              <button
                key={
                  action.label
                }
                onClick={() =>
                  navigate(
                    action.path
                  )
                }
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {
                      action.label
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {
                      action.description
                    }
                  </p>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}