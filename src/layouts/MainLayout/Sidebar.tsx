import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserRoundSearch,
  History,
  CalendarDays,
  Clock3,
  XCircle,
  FileCheck,
  Receipt,
  Wallet,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  ClipboardList,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  BookOpenText,
  Scale,
  MapPinned
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Complaints",
    icon: MessageSquare,
    path: "/complaints",
  },
//   {
//     label: "Dealer Allocation",
//     icon: UserRoundSearch,
//     path: "/allocation",
//   },

//   {
//     label: "Allocation History",
//     icon: History,
//     path: "/allocation/history",
//   },
  {
    label: "Dealers",
    icon: Users,
    path: "/dealers",
  },

  {
    label: "Appointments",
    icon: CalendarDays,
    path: "/appointments",
  },
  {
    label: "Pending & SLA",
    icon: Clock3,
    path: "/pending",
  },
  {
    label: "Cancellation",
    icon: XCircle,
    path: "/cancellations",
  },
  {
  label: "Closure History",
  icon: FileCheck2,
  path: "/closures/history",
},
  {
    label: "DG Verification",
    icon: BadgeCheck,
    path: "/verification",
  },
  
  {
    label: "Billing",
    icon: Receipt,
    path: "/billing",
  },
  {
    label: "Dealer Ledger",
    icon: BookOpenText,
    path: "/ledger",
  },
//   {
//     label: "Payments",
//     icon: CreditCard,
//     path: "/payments",
//   },
//   {
//   label: "Reconciliation",
//   icon: Scale,
//   path: "/reconciliation",
// },
//   {
//     label: "Reports",
//     icon: BarChart3,
//     path: "/reports",
//   },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },

  {
  label: "Area Master",
  icon: MapPinned,
  path: "/area-master",
},
//   {
//     label: "Audit Logs",
//     icon: ClipboardList,
//     path: "/audit-logs",
//     // permission: "audit.view",
//   },
  {
    label: "Users",
    icon: Users,
    path: "/users",
  },

  {
    label: "Roles & Permissions",
    icon: ShieldCheck,
    path: "/roles",
  },
//   {
//     label: "Settings",
//     icon: Settings,
//     path: "/settings",
//   },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      
      {/* Logo - Fixed */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#123B7A] text-white">
            CM
          </div>

          <div>
            <h1 className="text-sm font-bold text-gray-900">
              Complaint
            </h1>
            <p className="text-xs text-gray-500">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-50 text-[#123B7A]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#123B7A]"
                  }
                `
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}