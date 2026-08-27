// import { useEffect } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";

// import DealerStatusBadge from "../components/DealerStatusBadge";
// import DealerCapacityCard from "../components/DealerCapacityCard";
// import DealerPerformanceCard from "../components/DealerPerformanceCard";

// import {
//   fetchDealerById,
// } from "../store/dealerSlice";

// import type {
//   AppDispatch,
//   RootState,
// } from "../../../app/store";

// export default function DealerDetailsPage() {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const dispatch =
//     useDispatch<AppDispatch>();

//   const {
//     selectedDealer,
//     loading,
//   } = useSelector(
//     (state: RootState) =>
//       state.dealers
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchDealerById(id));
//     }
//   }, [id, dispatch]);

//   if (loading || !selectedDealer) {
//     return (
//       <div className="p-8">
//         Loading dealer...
//       </div>
//     );
//   }

//   const dealer = selectedDealer;

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}

//       <div className="flex items-center justify-between">
//         <div>
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold">
//               {dealer.name}
//             </h1>

//             <DealerStatusBadge
//               status={dealer.status}
//             />
//           </div>

//           <p className="text-sm text-gray-500">
//             {dealer.dealerCode}
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             navigate(
//               `/dealers/${dealer._id}/edit`
//             )
//           }
//           className="rounded-lg border px-4 py-2"
//         >
//           Edit Dealer
//         </button>
//       </div>

//       {/* BASIC INFO */}

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div className="rounded-xl border bg-white p-6">
//           <h2 className="font-semibold">
//             Contact Information
//           </h2>

//           <div className="mt-4 space-y-3 text-sm">
//             <p>
//               <span className="text-gray-500">
//                 Email:
//               </span>{" "}
//               {dealer.email}
//             </p>

//             <p>
//               <span className="text-gray-500">
//                 Phone:
//               </span>{" "}
//               {dealer.phone}
//             </p>

//             <p>
//               <span className="text-gray-500">
//                 GST:
//               </span>{" "}
//               {dealer.gstNumber || "N/A"}
//             </p>
//           </div>
//         </div>

//         <div className="rounded-xl border bg-white p-6">
//           <h2 className="font-semibold">
//             Address
//           </h2>

//           <div className="mt-4 text-sm">
//             <p>
//               {dealer.address.addressLine1}
//             </p>

//             {dealer.address.addressLine2 && (
//               <p>
//                 {dealer.address.addressLine2}
//               </p>
//             )}

//             <p>
//               {dealer.address.city},{" "}
//               {dealer.address.state}
//             </p>

//             <p>
//               {dealer.address.pincode}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* CAPACITY */}

//       <DealerCapacityCard
//         capacity={dealer.capacity}
//       />

//       {/* PERFORMANCE */}

//       <DealerPerformanceCard
//         performance={dealer.performance}
//       />

//       <button
//         onClick={() =>
//           navigate(
//             `/dealers/${dealer._id}/performance`
//           )
//         }
//         className="rounded-lg bg-black px-5 py-3 text-white"
//       >
//         View Detailed Performance
//       </button>
//     </div>
//   );
// }


import {
  ArrowLeft,
  BarChart3,
  Edit,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import DealerCapacityCard from "../components/DealerCapacityCard";
import DealerPerformanceCard from "../components/DealerPerformanceCard";
import DealerStatusBadge from "../components/DealerStatusBadge";

import {
  useDealerDetails,
} from "../hooks/useDealers";

export default function DealerDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const {
    dealer,
    loading,
  } =
    useDealerDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        Loading dealer...
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <p className="text-gray-500">
          Dealer not found.
        </p>

        <button
          onClick={() =>
            navigate("/dealers")
          }
          className="mt-4 text-sm font-medium text-blue-600"
        >
          Back to Dealers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={() =>
            navigate("/dealers")
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Dealers
        </button>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(
                `/dealers/${dealer.id}/performance`
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <BarChart3
              size={17}
            />
            Performance
          </button>

          <button
            onClick={() =>
              navigate(
                `/dealers/${dealer.id}/edit`
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854]"
          >
            <Edit size={17} />
            Edit Dealer
          </button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {dealer.name}
              </h1>

              <DealerStatusBadge
                status={
                  dealer.status
                }
              />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {
                dealer.dealerCode
              }
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Performance Score
            </p>

            <p className="text-3xl font-bold text-[#123B7A]">
              {
                dealer.performance
                  .performanceScore
              }
              /100
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 md:grid-cols-2 xl:grid-cols-4">
          <Info
            icon={User}
            label="Owner"
            value={
              dealer.ownerName
            }
          />

          <Info
            icon={Phone}
            label="Phone"
            value={
              dealer.phone
            }
          />

          <Info
            icon={Mail}
            label="Email"
            value={
              dealer.email
            }
          />

          <Info
            icon={MapPin}
            label="Location"
            value={`${dealer.city}, ${dealer.state}`}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DealerCapacityCard
          total={
            dealer.capacity.total
          }
          used={
            dealer.capacity.used
          }
        />

        <DealerPerformanceCard
          performance={
            dealer.performance
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Supported Products
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {dealer.supportedProducts.map(
              (product) => (
                <span
                  key={product}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                >
                  {product}
                </span>
              )
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Address
          </h3>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            {dealer.address}
            <br />
            {dealer.city},{" "}
            {dealer.state}
            <br />
            {dealer.pincode}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900">
          Dealer Rates
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Rate
            label="Visit"
            value={
              dealer.rates.visit
            }
          />

          <Rate
            label="Service"
            value={
              dealer.rates.service
            }
          />

          <Rate
            label="Installation"
            value={
              dealer.rates
                .installation
            }
          />

          <Rate
            label="Uninstallation"
            value={
              dealer.rates
                .uninstallation
            }
          />

          <Rate
            label="Others"
            value={
              dealer.rates.other
            }
          />
        </div>
      </Card>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-gray-400">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function Rate({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-gray-900">
        ₹
        {value.toLocaleString(
          "en-IN"
        )}
      </p>
    </div>
  );
}