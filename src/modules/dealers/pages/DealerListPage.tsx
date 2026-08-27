// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import DealerFilters from "../components/DealerFilters";
// import DealerStats from "../components/DealerStats";
// import DealerTable from "../components/DealerTable";

// import { useDealers } from "../hooks/useDealers";

// export default function DealerListPage() {
//   const navigate = useNavigate();

//   const {
//     dealers,
//     stats,
//     loading,
//     filters,
//     loadDealers,
//     loadStats,
//     removeDealer,
//   } = useDealers();

//   useEffect(() => {
//     loadDealers();
//     loadStats();
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}

//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Dealers
//           </h1>

//           <p className="text-sm text-gray-500">
//             Manage all dealers
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             navigate("/dealers/create")
//           }
//           className="rounded-lg bg-black px-4 py-2 text-white"
//         >
//           + Add Dealer
//         </button>
//       </div>

//       <DealerStats stats={stats} />

//       <DealerFilters
//         filters={filters}
//         onChange={loadDealers}
//       />

//       <DealerTable
//         dealers={dealers}
//         loading={loading}
//         onDelete={removeDealer}
//       />
//     </div>
//   );
// }

import {
  Plus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppSelector,
} from "../../../app/hooks";

import DealerFilters from "../components/DealerFilters";
import DealerStats from "../components/DealerStats";
import DealerTable from "../components/DealerTable";

import {
  useDealers,
} from "../hooks/useDealers";

export default function DealerListPage() {
  const navigate =
    useNavigate();

  const {
    dealers,
    loading,
  } = useDealers();

  const {
    search,
    status,
    city,
  } = useAppSelector(
    (state) => state.dealers
  );

  const cities = Array.from(
    new Set(
      dealers.map(
        (dealer) => dealer.city
      )
    )
  );

  const filteredDealers =
    dealers.filter(
      (dealer) => {
        const query =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !query ||
          dealer.name
            .toLowerCase()
            .includes(query) ||
          dealer.dealerCode
            .toLowerCase()
            .includes(query) ||
          dealer.phone.includes(
            query
          ) ||
          dealer.ownerName
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "ALL" ||
          dealer.status ===
            status;

        const matchesCity =
          city === "ALL" ||
          dealer.city === city;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCity
        );
      }
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dealers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage dealer capacity,
            availability and
            performance.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/dealers/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus size={18} />
          Add Dealer
        </button>
      </div>

      <DealerStats
        dealers={dealers}
      />

      <DealerFilters
        cities={cities}
      />

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading dealers...
        </div>
      ) : (
        <DealerTable
          dealers={
            filteredDealers
          }
        />
      )}
    </div>
  );
}
