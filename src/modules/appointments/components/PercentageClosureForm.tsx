// import { useEffect, useMemo, useState } from "react";

// interface Props {
//   open: boolean;

//   billingType:
//     | "PARTIAL_PAYMENT"
//     | "PROFIT_SHARING";

//   percentage: number;

//   complaintNumber?: string;

//   loading?: boolean;

//   onClose: () => void;

//   onSubmit: (data: {
//     customerAmount: number;
//     profitAmount?: number;
//     percentage: number;
//     charge: number;
//   }) => Promise<void> | void;
// }

// export default function PercentageClosureModal({
//   open,
//   billingType,
//   // percentage,
//   complaintNumber,
//   loading = false,
//   onClose,
//   onSubmit,
// }: Props) {
//   const [customerAmount, setCustomerAmount] =
//     useState("");

//   const [profitAmount, setProfitAmount] =
//     useState("");

//   useEffect(() => {
//     if (open) {
//       setCustomerAmount("");
//       setProfitAmount("");
//     }
//   }, [open]);

//   const charge = useMemo(() => {
//     if (billingType === "PARTIAL_PAYMENT") {
//       return (
//         (Number(customerAmount || 0) *
//           Number(percentage || 0)) /
//         100
//       );
//     }

//     return (
//       (Number(profitAmount || 0) *
//         Number(percentage || 0)) /
//       100
//     );
//   }, [
//     billingType,
//     customerAmount,
//     profitAmount,
//     percentage,
//   ]);

//   if (!open) {
//     return null;
//   }

//   const handleSubmit = async () => {
//     const customer = Number(customerAmount);

//     if (!customer || customer <= 0) {
//       return;
//     }

//     if (billingType === "PROFIT_SHARING") {
//       const profit = Number(profitAmount);

//       if (!profit || profit <= 0) {
//         return;
//       }

//       if (profit > customer) {
//         return;
//       }
//     }

//     await onSubmit({
//       customerAmount: customer,

//       profitAmount:
//         billingType === "PROFIT_SHARING"
//           ? Number(profitAmount)
//           : undefined,

//       percentage,

//       charge,
//     });
//   };

//   const isInvalid =
//     !customerAmount ||
//     Number(customerAmount) <= 0 ||
//     (billingType === "PROFIT_SHARING" &&
//       (!profitAmount ||
//         Number(profitAmount) <= 0 ||
//         Number(profitAmount) >
//           Number(customerAmount)));

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

//         {/* HEADER */}

//         <div className="flex items-start justify-between border-b border-gray-100 p-5">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">
//               {billingType === "PARTIAL_PAYMENT"
//                 ? "Partial Payment Billing"
//                 : "Profit Sharing Billing"}
//             </h2>

//             <p className="mt-1 text-xs text-gray-500">
//               Complaint:{" "}
//               {complaintNumber || "-"}
//             </p>
//           </div>

//           <button
//             type="button"
//             disabled={loading}
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
//           >
//             ×
//           </button>
//         </div>

//         {/* BODY */}

//         <div className="space-y-5 p-5">

//           {/* CUSTOMER AMOUNT */}

//           <div>
//             <label className="mb-2 block text-xs font-semibold text-[#123B7A]">
//               Customer Amount
//             </label>

//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                 ₹
//               </span>

//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={customerAmount}
//                 onChange={(e) =>
//                   setCustomerAmount(
//                     e.target.value,
//                   )
//                 }
//                 placeholder="Enter customer amount"
//                 className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-[#123B7A]"
//               />
//             </div>
//           </div>

//           {/* PROFIT AMOUNT */}

//           {billingType ===
//             "PROFIT_SHARING" && (
//             <div>
//               <label className="mb-2 block text-xs font-semibold text-[#123B7A]">
//                 Profit Amount
//               </label>

//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                   ₹
//                 </span>

//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={profitAmount}
//                   onChange={(e) =>
//                     setProfitAmount(
//                       e.target.value,
//                     )
//                   }
//                   placeholder="Enter profit amount"
//                   className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-[#123B7A]"
//                 />
//               </div>

//               {profitAmount &&
//                 Number(profitAmount) >
//                   Number(customerAmount) && (
//                   <p className="mt-1 text-xs text-red-500">
//                     Profit amount cannot be
//                     greater than customer
//                     amount.
//                   </p>
//                 )}
//             </div>
//           )}

//           {/* BILLING PERCENTAGE */}

//           <div>
//             <label className="mb-2 block text-xs font-semibold text-[#123B7A]">
//               Billing Percentage
//             </label>

//             <div className="relative">
//               <input
//                 value={percentage}
//                 readOnly
//                 className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm text-gray-600"
//               />

//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                 %
//               </span>
//             </div>

//             <p className="mt-1 text-xs text-gray-400">
//               Configured during dealer
//               registration
//             </p>
//           </div>

//           {/* CALCULATION */}

//           <div className="rounded-xl bg-blue-50 p-4">
//             <p className="text-xs font-medium text-gray-500">
//               DG Billing Amount
//             </p>

//             <p className="mt-1 text-xl font-bold text-[#123B7A]">
//               ₹{charge.toFixed(2)}
//             </p>

//             <p className="mt-2 text-xs text-gray-500">
//               {billingType ===
//               "PARTIAL_PAYMENT"
//                 ? `₹${Number(
//                     customerAmount || 0,
//                   ).toFixed(
//                     2,
//                   )} × ${percentage}%`
//                 : `₹${Number(
//                     profitAmount || 0,
//                   ).toFixed(
//                     2,
//                   )} × ${percentage}%`}
//             </p>
//           </div>
//         </div>

//         {/* FOOTER */}

//         <div className="flex gap-3 border-t border-gray-100 p-5">
//           <button
//             type="button"
//             disabled={loading}
//             onClick={onClose}
//             className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             disabled={isInvalid || loading}
//             onClick={handleSubmit}
//             className="flex-1 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {loading
//               ? "Submitting..."
//               : "Submit for Approval"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";

interface Props {
  open: boolean;

  billingType: "PARTIAL_PAYMENT" | "PROFIT_SHARING";

  complaintNumber?: string;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (data: {
    customerAmount: number;
    profitAmount?: number;
  }) => Promise<void> | void;
}

export default function PercentageClosureModal({
  open,
  billingType,
  complaintNumber,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [customerAmount, setCustomerAmount] = useState("");

  const [profitAmount, setProfitAmount] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Reset form when modal opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (open) {
      setCustomerAmount("");
      setProfitAmount("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {
    const customer = Number(customerAmount);

    if (!Number.isFinite(customer) || customer <= 0) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PARTIAL PAYMENT
    |--------------------------------------------------------------------------
    */

    if (billingType === "PARTIAL_PAYMENT") {
      await onSubmit({
        customerAmount: customer,
      });

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PROFIT SHARING
    |--------------------------------------------------------------------------
    */

    const profit = Number(profitAmount);

    if (!Number.isFinite(profit) || profit <= 0) {
      return;
    }

    if (profit > customer) {
      return;
    }

    await onSubmit({
      customerAmount: customer,
      profitAmount: profit,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const customerInvalid = !customerAmount || Number(customerAmount) <= 0;

  const profitInvalid =
    billingType === "PROFIT_SHARING" &&
    (!profitAmount ||
      Number(profitAmount) <= 0 ||
      Number(profitAmount) > Number(customerAmount));

  const isInvalid = customerInvalid || profitInvalid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {billingType === "PARTIAL_PAYMENT"
                ? "Partial Payment Billing"
                : "Profit Sharing Billing"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Complaint: {complaintNumber || "-"}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-5">
          {/* CUSTOMER AMOUNT */}

          <div>
            <label className="mb-2 block text-xs font-semibold text-[#123B7A]">
              Customer Amount
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={customerAmount}
                disabled={loading}
                onChange={(e) => setCustomerAmount(e.target.value)}
                placeholder="Enter customer amount"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-[#123B7A] disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* PROFIT AMOUNT */}

          {billingType === "PROFIT_SHARING" && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#123B7A]">
                Profit Amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={profitAmount}
                  disabled={loading}
                  onChange={(e) => setProfitAmount(e.target.value)}
                  placeholder="Enter profit amount"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-[#123B7A] disabled:bg-gray-50"
                />
              </div>

              {profitAmount &&
                customerAmount &&
                Number(profitAmount) > Number(customerAmount) && (
                  <p className="mt-1 text-xs text-red-500">
                    Profit amount cannot be greater than customer amount.
                  </p>
                )}
            </div>
          )}

          {/* INFO */}

          {/* <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs leading-5 text-gray-600">
              Billing percentage and final billing amount will be calculated
              automatically from the dealer's registered billing configuration.
            </p>
          </div> */}
        </div>

        {/* FOOTER */}

        <div className="flex gap-3 border-t border-gray-100 p-5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isInvalid || loading}
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
