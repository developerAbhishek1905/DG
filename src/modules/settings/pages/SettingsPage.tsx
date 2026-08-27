import {
  Bell,
  Ban,
  Clock3,
  CreditCard,
  ListChecks,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const cards = [
  {
    title:
      "SLA Settings",

    description:
      "Configure workflow SLA durations, warning windows and escalation rules.",

    path:
      "/settings/sla",

    icon:
      Clock3,
  },

  {
    title:
      "Notification Settings",

    description:
      "Configure notification events and delivery channels.",

    path:
      "/settings/notifications",

    icon:
      Bell,
  },

  {
    title:
      "Billing Settings",

    description:
      "Configure billing automation, approvals, tax and ledger rules.",

    path:
      "/settings/billing",

    icon:
      CreditCard,
  },

  {
    title:
      "Status Settings",

    description:
      "Manage active workflow statuses and labels.",

    path:
      "/settings/statuses",

    icon:
      ListChecks,
  },

  {
    title:
      "Cancellation Reasons",

    description:
      "Manage reasons available when cancelling complaints.",

    path:
      "/settings/cancellation-reasons",

    icon:
      Ban,
  },

  {
    title:
      "Pending Reasons",

    description:
      "Manage standardized pending reasons.",

    path:
      "/settings/pending-reasons",

    icon:
      TimerReset,
  },

  {
    title:
      "Permission Settings",

    description:
      "Configure global permission availability and defaults.",

    path:
      "/settings/permissions",

    icon:
      ShieldCheck,
  },
];

export default function SettingsPage() {
  const navigate =
    useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#123B7A]">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure global application rules and business workflows.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <button
                key={
                  card.path
                }
                onClick={() =>
                  navigate(
                    card.path
                  )
                }
                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
                  <Icon
                    size={21}
                  />
                </div>

                <h2 className="mt-5 font-semibold text-gray-900">
                  {
                    card.title
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {
                    card.description
                  }
                </p>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}