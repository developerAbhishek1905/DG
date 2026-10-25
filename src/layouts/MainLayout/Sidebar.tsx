import {
  // LayoutDashboard,
  MessageSquare,
  Users,
  CalendarDays,
  Clock3,
  XCircle,
  Receipt,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  BookOpenText,
  MapPinned,
  MapPin,
  Tags,
  PackageSearch,
  LogOut,
  ChevronDown,
  ChevronRight,
  Boxes,
  Building2,
  Map,
  Hash,
  LocateFixed,
  Package,
  Shapes,
  UserCircle,
  UserRoundSearch,
  Wallet,
  Landmark,
} from "lucide-react";

import { useState, type MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../modules/auth/store/authSlice";
import { useAppSelector } from "../../app/hooks";
import { MessageCircleQuestion, PanelLeftClose, PanelLeftOpen } from "lucide-react";
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const menuItems = [
  // {
  //   label: "Dashboard",
  //   icon: LayoutDashboard,
  //   path: "/",
  //   permission: "dashboard.access",
  // },
  {
    label: "Complaints Management",
    icon: MessageSquare,
    path: "/complaints",
    permission: "complaints.access",
  },
  // {
  //   label: "Dealers Management",
  //   icon: Users,
  //   path: "/dealers",
  //   permission: "dealers.access",
  // },
  //   {
  //     label: "Category Master",
  //     icon: Tags,
  //     path: "/category-master",
  //     permission: "category.access",
  //   },
  //   {
  //     label: "Item Master",
  //     icon: PackageSearch,
  //     path: "/item-master",
  //     permission: "item.access",
  //   },
  {
    label: "Appointments",
    icon: CalendarDays,
    path: "/appointments",
    permission: "appointments.access",
  },
  // {
  //   label: "Pending & SLA",
  //   icon: Clock3,
  //   path: "/pending",
  //   permission: "pending.access",
  // },
  // {
  //   label: "Cancellation",
  //   icon: XCircle,
  //   path: "/cancellations",
  //   permission: "cancellations.access",
  // },
  // {
  //   label: "Closure History",
  //   icon: FileCheck2,
  //   path: "/closures/history",
  //   permission: "closures.access",
  // },
  {
    label: "DG Verification",
    icon: BadgeCheck,
    path: "/verification",
    permission: "complaints.access",
  },
    // {
    //   label: "Billing",
    //   icon: Receipt,
    //   path: "/billing",
    //   permission: "billing.access",
    // },
    // {
    //   label: "Dealer Ledger",
    //   icon: BookOpenText,
    //   path: "/ledger",
    //   permission: "ledger.access",
    // },
  // {
  //   label: "Notifications",
  //   icon: Bell,
  //   path: "/notifications",
  //   permission: "notifications.access",
  // },
  // {
  //   label: "Area Master",
  //   icon: MapPinned,
  //   path: "/area-master",
  //   permission: "area.access",
  // },
  {
    label: "Dealer Allocation",
    icon: UserRoundSearch,
    path: "/allocation",
  },

  //   //   {
  //   //     label: "Allocation History",
  //   //     icon: History,
  //   //     path: "/allocation/history",
  //   //   },
  {
    label: "Reason Master",
    path: "/reason-master",
    icon: MessageCircleQuestion,
    permission: "reason.access",
  },
  {
    label: "Users",
    icon: Users,
    path: "/users",
    permission: "users.access",
  },
  {
    label: "Roles & Permissions",
    icon: ShieldCheck,
    path: "/roles",
    permission: "roles.access",
  },
];

const productManagementItems = [
  {
    label: "Category Master",
    icon: Tags,
    path: "/category-master",
    permission: "category.access",
  },
  {
    label: "Brand Master",
    icon: PackageSearch,
    path: "/brand-master",
    permission: "brand.access",
  },
  {
    label: "Product Type Master",
    icon: Shapes,
    path: "/product-type-master",
    permission: "product_type.access",
  },
  {
    label: "Product Master",
    icon: Package,
    path: "/product-master",
    permission: "product.access",
  },
];

const addressMasterItems = [
  {
    label: "State Master",
    icon: Map,
    path: "/state-master",
    permission: "state.access",
  },
  {
    label: "District Master",
    icon: Building2,
    path: "/district-master",
    permission: "district.access",
  },
  {
    label: "City Master",
    icon: MapPin,
    path: "/city-master",
    permission: "city.access",
  },
  {
    label: "Pincode Master",
    icon: Hash,
    path: "/pincode-master",
    permission: "pincode.access",
  },
  {
    label: "Area Master",
    icon: LocateFixed,
    path: "/area-master",
    permission: "area.access",
  },
];

const dealerManagementItems = [
  {
    label: "Dealers",
    icon: Users,
    path: "/dealers",
    permission: "dealers.access",
  },
  {
    label: "Dealer Activity",
    icon: Clock3,
    path: "/dealer-activity",
    permission: "dealers.access",
  },
];

const accountManagementItems = [
  // {
  //   label: "Account",
  //   icon: Landmark,
  //   path: "/accounts",
  //   // permission: "accounts.access",
  // },
  {
    label: "Billing",
    icon: Receipt,
    path: "/billing",
    permission: "billing.access",
  },
  {
    label: "Dealer Ledger",
    icon: BookOpenText,
    path: "/ledger",
    permission: "ledger.access",
  },
];

export default function Sidebar({
  isOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  // Collapse only applies on desktop (lg+); mobile drawer always shows full menu
  const labelCls = collapsed ? "lg:hidden" : "";
  const jc = collapsed ? "lg:justify-center" : "";

  // Instant hover tooltip for icon-only (collapsed) view
  const [tooltip, setTooltip] = useState<{
    label: string;
    top: number;
    left: number;
  } | null>(null);

  const tip = (label: string) =>
    collapsed
      ? {
          onMouseEnter: (e: MouseEvent<HTMLElement>) => {
            if (window.innerWidth < 1024) return;
            const r = e.currentTarget.getBoundingClientRect();
            setTooltip({ label, top: r.top + r.height / 2, left: r.right + 10 });
          },
          onMouseLeave: () => setTooltip(null),
        }
      : {};
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);

  const permissions = auth.user?.role?.permissions ?? [];

  const isDealerRoute = dealerManagementItems.some((item) =>
    location.pathname.startsWith(item.path),
  );

  const isProductRoute = productManagementItems.some((item) =>
    location.pathname.startsWith(item.path),
  );
  const isAddressRoute = addressMasterItems.some((item) =>
    location.pathname.startsWith(item.path),
  );

  const isAccountRoute = accountManagementItems.some(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`),
  );

  const [accountOpen, setAccountOpen] = useState(isAccountRoute);

  const [dealerOpen, setDealerOpen] = useState(isDealerRoute);
  const [productOpen, setProductOpen] = useState(isProductRoute);
  const [addressOpen, setAddressOpen] = useState(isAddressRoute);

  /**
   * Check whether logged-in user has given permission
   */
  const hasPermission = (permission?: string) => {
    // If menu doesn't require permission, allow it
    if (!permission) {
      return true;
    }

    return permissions.includes(permission);
  };

  /**
   * Only return allowed sidebar menus
   */
  const allowedMenuItems = menuItems.filter((item) =>
    hasPermission(item.permission),
  );

  const allowedDealerItems = dealerManagementItems.filter((item) =>
    hasPermission(item.permission),
  );

  const allowedProductItems = productManagementItems.filter((item) =>
    hasPermission(item.permission),
  );

  const allowedAddressItems = addressMasterItems.filter((item) =>
    hasPermission(item.permission),
  );

  const allowedAccountItems = accountManagementItems.filter((item) =>
    hasPermission(item.permission),
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    dispatch(logoutSuccess());

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-40
          flex h-screen w-64 flex-col
          border-r border-gray-200 bg-white
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : ""}

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Desktop collapse / expand toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-5 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-[#123B7A] lg:flex"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>

        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          className={`flex h-16 shrink-0 items-center border-b border-gray-200 px-5 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg bg-[#123B7A] text-white
              "
            >
              CM
            </div>

            <div className={labelCls}>
              <h1 className="text-sm font-bold text-gray-900">Complaint</h1>

              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {/* =================================================
              FIRST THREE MENUS
          ================================================== */}

          {allowedMenuItems.slice(0, 1).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                {...tip(item.label)}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 ${jc}
                    rounded-lg px-3 py-2.5
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

                <span className={labelCls}>{item.label}</span>
              </NavLink>
            );
          })}

          {/* =================================================
    DEALER MANAGEMENT DROPDOWN
================================================== */}

          {allowedDealerItems.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setDealerOpen((prev) => !prev)}
                {...tip("Dealers Management")}
                className={`
        flex w-full items-center justify-between ${jc}
        rounded-lg px-3 py-2.5
        text-sm font-medium transition

        ${
          isDealerRoute
            ? "bg-blue-50 text-[#123B7A]"
            : "text-gray-600 hover:bg-gray-50 hover:text-[#123B7A]"
        }
      `}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span className={labelCls}>Dealers Management</span>
                </div>

                <ChevronDown
                  size={17}
                  className={`
          transition-transform duration-200 ${collapsed ? "lg:hidden" : ""}
          ${dealerOpen ? "rotate-180" : ""}
        `}
                />
              </button>

              {/* Dealer Dropdown */}
              <div
                className={`
        overflow-hidden
        transition-all duration-300

        ${dealerOpen ? "mt-1 max-h-32 opacity-100" : "max-h-0 opacity-0"}
      `}
              >
                <div
                  className={`
          ml-4 space-y-1
          border-l border-gray-200
          pl-3 ${collapsed ? "lg:ml-0 lg:border-l-0 lg:pl-0" : ""}
        `}
                >
                  {allowedDealerItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                {...tip(item.label)}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                  flex items-center gap-3 ${jc}
                  rounded-lg px-3 py-2
                  text-sm transition

                  ${
                    isActive
                      ? "bg-blue-50 font-medium text-[#123B7A]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#123B7A]"
                  }
                `
                        }
                      >
                        <Icon size={16} />
                        <span className={labelCls}>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              PRODUCT MANAGEMENT DROPDOWN
          ================================================== */}
          {hasPermission("productMaster.access") &&
            allowedProductItems.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setProductOpen((prev) => !prev)}
                {...tip("Product Management")}
                  className={`
                  flex w-full items-center justify-between ${jc}
                  rounded-lg px-3 py-2.5
                  text-sm font-medium transition

                  ${
                    isProductRoute
                      ? "bg-blue-50 text-[#123B7A]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#123B7A]"
                  }
                `}
                >
                  <div className="flex items-center gap-3">
                    <Boxes size={18} />

                    <span className={labelCls}>Product Management</span>
                  </div>

                  <ChevronDown
                    size={17}
                    className={`
                    transition-transform duration-200 ${collapsed ? "lg:hidden" : ""}

                    ${productOpen ? "rotate-180" : ""}
                  `}
                  />
                </button>

                {/* Product Dropdown */}

                <div
                  className={`
                  overflow-hidden
                  transition-all duration-300

                  ${
                    productOpen
                      ? "mt-1 max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
                >
                  <div
                    className={`
                    ml-4 space-y-1
                    border-l border-gray-200
                    pl-3 ${collapsed ? "lg:ml-0 lg:border-l-0 lg:pl-0" : ""}
                  `}
                  >
                    {allowedProductItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                {...tip(item.label)}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `
                            flex items-center gap-3 ${jc}
                            rounded-lg px-3 py-2
                            text-sm transition

                            ${
                              isActive
                                ? "bg-blue-50 font-medium text-[#123B7A]"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#123B7A]"
                            }
                          `
                          }
                        >
                          <Icon size={16} />

                          <span className={labelCls}>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          {/* =================================================
              ADDRESS MASTER DROPDOWN
          ================================================== */}

          {hasPermission("address.access") &&
            allowedAddressItems.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setAddressOpen((prev) => !prev)}
                {...tip("Address Management")}
                  className={`
                  flex w-full items-center justify-between ${jc}
                  rounded-lg px-3 py-2.5
                  text-sm font-medium transition

                  ${
                    isAddressRoute
                      ? "bg-blue-50 text-[#123B7A]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#123B7A]"
                  }
                `}
                >
                  <div className="flex items-center gap-3">
                    <MapPinned size={18} />

                    <span className={labelCls}>Address Management</span>
                  </div>

                  <ChevronDown
                    size={17}
                    className={`
                    transition-transform duration-200 ${collapsed ? "lg:hidden" : ""}

                    ${addressOpen ? "rotate-180" : ""}
                  `}
                  />
                </button>

                {/* Address Master Dropdown */}

                <div
                  className={`
                  overflow-hidden
                  transition-all duration-300

                  ${
                    addressOpen
                      ? "mt-1 max-h-80 opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
                >
                  <div
                    className={`
                    ml-4 space-y-1
                    border-l border-gray-200
                    pl-3 ${collapsed ? "lg:ml-0 lg:border-l-0 lg:pl-0" : ""}
                  `}
                  >
                    {allowedAddressItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                {...tip(item.label)}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `
                            flex items-center gap-3 ${jc}
                            rounded-lg px-3 py-2
                            text-sm transition

                            ${
                              isActive
                                ? "bg-blue-50 font-medium text-[#123B7A]"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#123B7A]"
                            }
                          `
                          }
                        >
                          <Icon size={16} />

                          <span className={labelCls}>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          {/* =================================================
              REMAINING SIDEBAR MENUS
          ================================================== */}

          {/* ACCOUNT MANAGEMENT DROPDOWN */}

          {allowedAccountItems.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                {...tip("Account Management")}
                className={`
        flex w-full items-center justify-between ${jc}
        rounded-lg px-3 py-2.5
        text-sm font-medium transition

        ${
          isAccountRoute
            ? "bg-blue-50 text-[#123B7A]"
            : "text-gray-600 hover:bg-gray-50 hover:text-[#123B7A]"
        }
      `}
              >
                <div className="flex items-center gap-3">
                  <Wallet size={18} />
                  <span className={labelCls}>Account Management</span>
                </div>

                <ChevronDown
                  size={17}
                  className={`
          transition-transform duration-200 ${collapsed ? "lg:hidden" : ""}
          ${accountOpen ? "rotate-180" : ""}
        `}
                />
              </button>

              {/* Dropdown Items */}

              <div
                className={`
        overflow-hidden
        transition-all duration-300

        ${accountOpen ? "mt-1 max-h-40 opacity-100" : "max-h-0 opacity-0"}
      `}
              >
                <div
                  className={`
          ml-4 space-y-1
          border-l border-gray-200
          pl-3 ${collapsed ? "lg:ml-0 lg:border-l-0 lg:pl-0" : ""}
        `}
                >
                  {allowedAccountItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                {...tip(item.label)}
                        onClick={onClose}
                        className={({ isActive }) => `
                flex items-center gap-3 ${jc}
                rounded-lg px-3 py-2
                text-sm transition

                ${
                  isActive
                    ? "bg-blue-50 font-medium text-[#123B7A]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#123B7A]"
                }
              `}
                      >
                        <Icon size={16} />
                        <span className={labelCls}>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {allowedMenuItems.slice(1).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                {...tip(item.label)}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 ${jc}
                    rounded-lg px-3 py-2.5
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

                <span className={labelCls}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* =====================================================
            LOGOUT
        ====================================================== */}

        {/* <div className="shrink-0 border-t border-gray-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
              rounded-lg px-3 py-2.5
              text-sm font-medium
              text-red-600 transition
              hover:bg-red-50
            "
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div> */}

        {/* =====================================================
    USER PROFILE + LOGOUT - SINGLE ROW
====================================================== */}

        <div className="shrink-0 border-t border-gray-200 p-3">
          <div
            className={`
      flex items-center gap-2
      rounded-lg px-2 py-2
      transition
      hover:bg-gray-50
      ${collapsed ? "lg:flex-col" : ""}
    `}
          >
            {/* Profile Click Area */}

            <button
              type="button"
              {...tip(auth.user?.name || "Profile")}
              onClick={() => {
                navigate("/profile");
                onClose?.();
              }}
              className="
        flex min-w-0 flex-1
        items-center gap-3
        text-left
      "
            >
              {/* Avatar */}

              <div
                className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-full bg-[#123B7A]
          text-sm font-semibold text-white
        "
              >
                {auth.user?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"}
              </div>

              {/* User Details */}

              <div className={`min-w-0 flex-1 ${labelCls}`}>
                <p className="truncate text-sm font-semibold text-gray-800">
                  {auth.user?.name || "User"}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {auth.user?.role?.name || "User"}
                </p>
              </div>
            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              {...tip("Logout")}
              className=" flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600 "
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {collapsed && tooltip && (
        <>
          <style>{`
            @keyframes sbTipIn {
              from { opacity: 0; transform: translate(-6px, -50%); }
              to { opacity: 1; transform: translate(0, -50%); }
            }
          `}</style>
          <div
            style={{
              top: tooltip.top,
              left: tooltip.left,
              animation: "sbTipIn 160ms ease-out forwards",
            }}
            className="pointer-events-none fixed z-[60] hidden lg:block"
          >
            <div className="relative flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#123B7A] px-3 py-2 text-[13px] font-semibold tracking-tight text-white shadow-[0_8px_24px_-6px_rgba(18,59,122,0.55)] ring-1 ring-white/10">
              {/* Arrow */}
              <span className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] bg-[#123B7A]" />
              <span className="relative">{tooltip.label}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
