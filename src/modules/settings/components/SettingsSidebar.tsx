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
  NavLink,
} from "react-router-dom";

const menu = [
  {
    label:
      "SLA Settings",
    path:
      "/settings/sla",
    icon:
      Clock3,
  },

  {
    label:
      "Notifications",
    path:
      "/settings/notifications",
    icon:
      Bell,
  },

  {
    label:
      "Billing",
    path:
      "/settings/billing",
    icon:
      CreditCard,
  },

  {
    label:
      "Statuses",
    path:
      "/settings/statuses",
    icon:
      ListChecks,
  },

  {
    label:
      "Cancellation Reasons",
    path:
      "/settings/cancellation-reasons",
    icon:
      Ban,
  },

  {
    label:
      "Pending Reasons",
    path:
      "/settings/pending-reasons",
    icon:
      TimerReset,
  },

  {
    label:
      "Permissions",
    path:
      "/settings/permissions",
    icon:
      ShieldCheck,
  },
];

export default function SettingsSidebar() {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Configuration
      </p>

      <nav className="space-y-1">
        {menu.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={
                  item.path
                }
                to={
                  item.path
                }
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-[#123B7A]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon
                  size={17}
                />

                {
                  item.label
                }
              </NavLink>
            );
          }
        )}
      </nav>
    </aside>
  );
}