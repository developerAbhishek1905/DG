// import { useEffect } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";

// import DealerForm from "../components/DealerForm";

// import {
//   fetchDealerById,
//   updateDealer,
// } from "../store/dealerSlice";

// import type {
//   DealerFormData,
// } from "../types/dealer.types";

// import type {
//   AppDispatch,
//   RootState,
// } from "../../../app/store";

// export default function EditDealerPage() {
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

//   const handleSubmit = async (
//     data: DealerFormData
//   ) => {
//     if (!id) return;

//     const result = await dispatch(
//       updateDealer({
//         id,
//         data,
//       })
//     );

//     if (
//       updateDealer.fulfilled.match(result)
//     ) {
//       navigate(`/dealers/${id}`);
//     }
//   };

//   if (!selectedDealer) {
//     return (
//       <div className="p-8">
//         Loading dealer...
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-5xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">
//           Edit Dealer
//         </h1>
//       </div>

//       <DealerForm
//         dealer={selectedDealer}
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
  useParams,
} from "react-router-dom";

import DealerForm from "../components/DealerForm";

import {
  useDealerDetails,
} from "../hooks/useDealers";

import {
  updateDealer,
} from "../services/dealerApi";

import type {
  DealerFormData,
} from "../types/dealer.types";

export default function EditDealerPage() {
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
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading dealer...
      </div>
    );
  }

  if (!dealer || !id) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Dealer not found.
      </div>
    );
  }

  const handleUpdate = async (
    data: DealerFormData
  ) => {
    await updateDealer(
      id,
      data
    );

    navigate(
      `/dealers/${id}`
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            `/dealers/${id}`
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Dealer
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Dealer
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update dealer
          information and
          configuration.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <DealerForm
          dealer={dealer}
          onSubmit={
            handleUpdate
          }
          submitLabel="Update Dealer"
        />
      </div>
    </div>
  );
}