import { useState } from "react";
import PermissionGuard from "../../routes/PermissionGuard";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu } from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebarCollapsed", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />
{/* <Header></Header> */}
      {/* Main Section */}
      <div className={`flex h-screen flex-col transition-[margin] duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}>
        {/* Mobile Header */}
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Main Content Scroll Area */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <PermissionGuard>
            <Outlet />
          </PermissionGuard>
        </main>
      </div>
    </div>
  );
}
