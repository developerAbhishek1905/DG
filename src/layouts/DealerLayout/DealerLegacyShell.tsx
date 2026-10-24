import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Plain shell for the detailed screens (full complaint details, billing, statement, profile). */
export default function DealerLegacyShell() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/dealer")}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
        >
          <ArrowLeft size={16} /> Dealer Home
        </button>
        <Outlet />
      </div>
    </div>
  );
}
