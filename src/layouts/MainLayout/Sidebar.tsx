import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarDays,
  Clock3,
  XCircle,
  Receipt,
  Bell,
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
  Boxes,
  Building2,
  Map,
  Hash,
  LocateFixed,
  Package,
  Shapes,
} from "lucide-react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../modules/auth/store/authSlice";
import { useAppSelector } from "../../app/hooks";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    permission: "dashboard.access",
  },
  {
    label: "Complaints Management",
    icon: MessageSquare,
    path: "/complaints",
    permission: "complaints.access",
  },
  {
    label: "Dealers Management",
    icon: Users,
    path: "/dealers",
    permission: "dealers.access",
  },
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
  {
    label: "Pending & SLA",
    icon: Clock3,
    path: "/pending",
    permission: "pending.access",
  },
  {
    label: "Cancellation",
    icon: XCircle,
    path: "/cancellations",
    permission: "cancellations.access",
  },
  {
    label: "Closure History",
    icon: FileCheck2,
    path: "/closures/history",
    permission: "closures.access",
  },
  {
    label: "DG Verification",
    icon: BadgeCheck,
    path: "/verification",
    permission: "complaints.access",
  },
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
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    permission: "notifications.access",
  },
  // {
  //   label: "Area Master",
  //   icon: MapPinned,
  //   path: "/area-master",
  //   permission: "area.access",
  // },
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
    // permission: "productType.access",
  },
  {
    label: "Product Master",
    icon: Package,
    path: "/product-master",
    // permission: "product.access",
  },
];

const addressMasterItems = [
  {
    label: "State Master",
    icon: Map,
    path: "/state-master",
    // permission: "state.access",
    permission: "area.access",
  },
  {
    label: "District Master",
    icon: Building2,
    path: "/district-master",
    // permission: "district.access",
    permission: "area.access",
  },
  {
    label: "City Master",
    icon: MapPin,
    path: "/city-master",
    // permission: "city.access",
    permission: "area.access",
  },
  {
    label: "Pincode Master",
    icon: Hash,
    path: "/pincode-master",
    // permission: "pincode.access",
    permission: "area.access",
  },
  {
    label: "Area Master",
    icon: LocateFixed,
    path: "/area-master",
    permission: "area.access",
  },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useAppSelector((state) => state.auth);

  const permissions = auth.user?.role?.permissions ?? [];

  const isProductRoute = productManagementItems.some((item) =>
    location.pathname.startsWith(item.path),
  );
  const isAddressRoute = addressMasterItems.some((item) =>
    location.pathname.startsWith(item.path),
  );

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

  const allowedProductItems = productManagementItems.filter((item) =>
    hasPermission(item.permission),
  );

  const allowedAddressItems = addressMasterItems.filter((item) =>
    hasPermission(item.permission),
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
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
          transition-transform duration-300 ease-in-out
          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg bg-[#123B7A] text-white
              "
            >
              CM
            </div>

            <div>
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

          {allowedMenuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
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

                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* =================================================
              PRODUCT MANAGEMENT DROPDOWN
          ================================================== */}

          {allowedProductItems.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setProductOpen((prev) => !prev)}
                className={`
                  flex w-full items-center justify-between
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

                  <span>Product Management</span>
                </div>

                <ChevronDown
                  size={17}
                  className={`
                    transition-transform duration-200

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
                  className="
                    ml-4 space-y-1
                    border-l border-gray-200
                    pl-3
                  "
                >
                  {allowedProductItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                            flex items-center gap-3
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

                        <span>{item.label}</span>
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

          {allowedAddressItems.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setAddressOpen((prev) => !prev)}
                className={`
                  flex w-full items-center justify-between
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

                  <span>Address Management</span>
                </div>

                <ChevronDown
                  size={17}
                  className={`
                    transition-transform duration-200

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
                  className="
                    ml-4 space-y-1
                    border-l border-gray-200
                    pl-3
                  "
                >
                  {allowedAddressItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                            flex items-center gap-3
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

                        <span>{item.label}</span>
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

          {allowedMenuItems.slice(3).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
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

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* =====================================================
            LOGOUT
        ====================================================== */}

        <div className="shrink-0 border-t border-gray-200 p-3">
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
        </div>
      </aside>
    </>
  );
}
