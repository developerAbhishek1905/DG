import {
  Bell,
  Search,
  User,
} from "lucide-react";

import {
  NotificationDropdown,
} from "../../modules/notifications";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search complaints, dealers..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* <button className="relative text-gray-500 hover:text-gray-800">
          <Bell size={20} />

          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            7
          </span>
        </button> */}
        <div className="flex items-center gap-3">

  <NotificationDropdown />

  {/* Existing Profile Dropdown */}

</div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[#123B7A]">
            <User size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Admin User
            </p>

            <p className="text-xs text-gray-500">
              DG Team
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}