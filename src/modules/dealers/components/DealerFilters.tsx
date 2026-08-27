// import type {
//   DealerFilters as DealerFilterType,
// } from "../types/dealer.types";

// interface Props {
//   filters: DealerFilterType;

//   onChange: (
//     filters: DealerFilterType
//   ) => void;
// }

// export default function DealerFilters({
//   filters,
//   onChange,
// }: Props) {
//   return (
//     <div className="rounded-xl border bg-white p-4">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//         <input
//           type="text"
//           placeholder="Search dealer..."
//           value={filters.search || ""}
//           onChange={(e) =>
//             onChange({
//               search: e.target.value,
//               page: 1,
//             })
//           }
//           className="rounded-lg border px-3 py-2 outline-none focus:ring-2"
//         />

//         <select
//           value={filters.status || ""}
//           onChange={(e) =>
//             onChange({
//               status:
//                 e.target.value as any,
//               page: 1,
//             })
//           }
//           className="rounded-lg border px-3 py-2"
//         >
//           <option value="">
//             All Status
//           </option>

//           <option value="active">
//             Active
//           </option>

//           <option value="inactive">
//             Inactive
//           </option>

//           <option value="suspended">
//             Suspended
//           </option>
//         </select>

//         <input
//           type="text"
//           placeholder="City"
//           value={filters.city || ""}
//           onChange={(e) =>
//             onChange({
//               city: e.target.value,
//               page: 1,
//             })
//           }
//           className="rounded-lg border px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="State"
//           value={filters.state || ""}
//           onChange={(e) =>
//             onChange({
//               state: e.target.value,
//               page: 1,
//             })
//           }
//           className="rounded-lg border px-3 py-2"
//         />
//       </div>
//     </div>
//   );
// }

import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearDealerFilters,
  setDealerCity,
  setDealerSearch,
  setDealerStatus,
} from "../store/dealerSlice";

import type {
  DealerStatus,
} from "../types/dealer.types";

interface Props {
  cities: string[];
}

export default function DealerFilters({
  cities,
}: Props) {
  const dispatch = useAppDispatch();

  const {
    search,
    status,
    city,
  } = useAppSelector(
    (state) => state.dealers
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              dispatch(
                setDealerSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search dealer name, code, phone..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setDealerStatus(
                event.target.value as
                  | DealerStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

          <option value="SUSPENDED">
            Suspended
          </option>
        </select>

        <select
          value={city}
          onChange={(event) =>
            dispatch(
              setDealerCity(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none"
        >
          <option value="ALL">
            All Cities
          </option>

          {cities.map((cityName) => (
            <option
              key={cityName}
              value={cityName}
            >
              {cityName}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            dispatch(clearDealerFilters())
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}