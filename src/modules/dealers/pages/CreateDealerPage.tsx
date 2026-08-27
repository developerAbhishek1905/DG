// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import DealerForm from "../components/DealerForm";

// import {
//   createDealer,
// } from "../store/dealerSlice";

// import type {
//   DealerFormData,
// } from "../types/dealer.types";

// import type {
//   AppDispatch,
//   RootState,
// } from "../../../app/store";

// export default function CreateDealerPage() {
//   const navigate = useNavigate();

//   const dispatch =
//     useDispatch<AppDispatch>();

//   const loading = useSelector(
//     (state: RootState) =>
//       state.dealers.loading
//   );

//   const handleSubmit = async (
//     data: DealerFormData
//   ) => {
//     const result = await dispatch(
//       createDealer(data)
//     );

//     if (
//       createDealer.fulfilled.match(result)
//     ) {
//       navigate("/dealers");
//     }
//   };

//   return (
//     <div className="mx-auto max-w-5xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">
//           Create Dealer
//         </h1>

//         <p className="text-sm text-gray-500">
//           Add a new dealer
//         </p>
//       </div>

//       <DealerForm
//         loading={loading}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// }


import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import DealerForm from "../components/DealerForm";

import {
  createDealer,
} from "../services/dealerApi";

import type {
  DealerFormData,
} from "../types/dealer.types";

export default function CreateDealerPage() {
  const navigate =
    useNavigate();

  const handleCreate = async (
    data: DealerFormData
  ) => {
    const dealer =
      await createDealer(data);

    navigate(
      `/dealers/${dealer.id}`
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate("/dealers")
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Dealers
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create Dealer
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a dealer and configure
          their service capacity.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <DealerForm
          onSubmit={handleCreate}
          submitLabel="Create Dealer"
        />
      </div>
    </div>
  );
}