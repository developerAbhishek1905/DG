// import { useEffect, useState } from "react";

// import type {
//   Dealer,
//   DealerFormData,
// } from "../types/dealer.types";

// interface Props {
//   dealer?: Dealer | null;

//   loading?: boolean;

//   onSubmit: (
//     data: DealerFormData
//   ) => void;
// }

// const defaultForm: DealerFormData = {
//   name: "",
//   email: "",
//   phone: "",
//   gstNumber: "",

//   status: "active",

//   address: {
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     pincode: "",
//   },

//   totalCapacity: 0,
// };

// export default function DealerForm({
//   dealer,
//   loading,
//   onSubmit,
// }: Props) {
//   const [form, setForm] =
//     useState<DealerFormData>(defaultForm);

//   useEffect(() => {
//     if (!dealer) return;

//     setForm({
//       name: dealer.name,
//       email: dealer.email,
//       phone: dealer.phone,
//       gstNumber: dealer.gstNumber,

//       status: dealer.status,

//       address: dealer.address,

//       totalCapacity:
//         dealer.capacity.totalCapacity,
//     });
//   }, [dealer]);

//   const updateField = (
//     field: keyof DealerFormData,
//     value: any
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const updateAddress = (
//     field: keyof DealerFormData["address"],
//     value: string
//   ) => {
//     setForm((prev) => ({
//       ...prev,

//       address: {
//         ...prev.address,
//         [field]: value,
//       },
//     }));
//   };

//   const submit = (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     onSubmit(form);
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="space-y-6"
//     >
//       {/* BASIC INFORMATION */}

//       <div className="rounded-xl border bg-white p-6">
//         <h2 className="mb-5 text-lg font-semibold">
//           Dealer Information
//         </h2>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <input
//             required
//             placeholder="Dealer Name"
//             value={form.name}
//             onChange={(e) =>
//               updateField(
//                 "name",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <input
//             required
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) =>
//               updateField(
//                 "email",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <input
//             required
//             placeholder="Phone"
//             value={form.phone}
//             onChange={(e) =>
//               updateField(
//                 "phone",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <input
//             placeholder="GST Number"
//             value={form.gstNumber || ""}
//             onChange={(e) =>
//               updateField(
//                 "gstNumber",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <select
//             value={form.status}
//             onChange={(e) =>
//               updateField(
//                 "status",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="active">
//               Active
//             </option>

//             <option value="inactive">
//               Inactive
//             </option>

//             <option value="suspended">
//               Suspended
//             </option>
//           </select>

//           <input
//             required
//             type="number"
//             min={0}
//             placeholder="Total Capacity"
//             value={form.totalCapacity}
//             onChange={(e) =>
//               updateField(
//                 "totalCapacity",
//                 Number(e.target.value)
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* ADDRESS */}

//       <div className="rounded-xl border bg-white p-6">
//         <h2 className="mb-5 text-lg font-semibold">
//           Address
//         </h2>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <input
//             required
//             placeholder="Address Line 1"
//             value={
//               form.address.addressLine1
//             }
//             onChange={(e) =>
//               updateAddress(
//                 "addressLine1",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2 md:col-span-2"
//           />

//           <input
//             placeholder="Address Line 2"
//             value={
//               form.address.addressLine2 || ""
//             }
//             onChange={(e) =>
//               updateAddress(
//                 "addressLine2",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2 md:col-span-2"
//           />

//           <input
//             required
//             placeholder="City"
//             value={form.address.city}
//             onChange={(e) =>
//               updateAddress(
//                 "city",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <input
//             required
//             placeholder="State"
//             value={form.address.state}
//             onChange={(e) =>
//               updateAddress(
//                 "state",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />

//           <input
//             required
//             placeholder="Pincode"
//             value={form.address.pincode}
//             onChange={(e) =>
//               updateAddress(
//                 "pincode",
//                 e.target.value
//               )
//             }
//             className="rounded-lg border px-3 py-2"
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
//       >
//         {loading
//           ? "Saving..."
//           : dealer
//           ? "Update Dealer"
//           : "Create Dealer"}
//       </button>
//     </form>
//   );
// }


import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  Dealer,
  DealerFormData,
  DealerStatus,
} from "../types/dealer.types";

interface Props {
  dealer?: Dealer;
  onSubmit: (
    data: DealerFormData
  ) => Promise<void> | void;
  submitLabel?: string;
}

const products = [
  "Air Conditioner",
  "Washing Machine",
  "Refrigerator",
  "Television",
  "Microwave",
  "Water Purifier",
];

export default function DealerForm({
  dealer,
  onSubmit,
  submitLabel = "Save Dealer",
}: Props) {
  const [selectedProducts, setSelectedProducts] =
    useState<string[]>(
      dealer?.supportedProducts ?? []
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<DealerFormData>({
    defaultValues: {
      name: dealer?.name ?? "",
      ownerName:
        dealer?.ownerName ?? "",
      email: dealer?.email ?? "",
      phone: dealer?.phone ?? "",
      city: dealer?.city ?? "",
      state: dealer?.state ?? "",
      address: dealer?.address ?? "",
      pincode: dealer?.pincode ?? "",
      totalCapacity:
        dealer?.capacity.total ?? 10,
      status:
        dealer?.status ?? "ACTIVE",
      supportedProducts:
        dealer?.supportedProducts ?? [],
    },
  });

  useEffect(() => {
    if (!dealer) return;

    reset({
      name: dealer.name,
      ownerName: dealer.ownerName,
      email: dealer.email,
      phone: dealer.phone,
      city: dealer.city,
      state: dealer.state,
      address: dealer.address,
      pincode: dealer.pincode,
      totalCapacity:
        dealer.capacity.total,
      status: dealer.status,
      supportedProducts:
        dealer.supportedProducts,
    });

    setSelectedProducts(
      dealer.supportedProducts
    );
  }, [dealer, reset]);

  const toggleProduct = (
    product: string
  ) => {
    setSelectedProducts(
      (current) =>
        current.includes(product)
          ? current.filter(
              (item) =>
                item !== product
            )
          : [...current, product]
    );
  };

  const submitForm = async (
    data: DealerFormData
  ) => {
    await onSubmit({
      ...data,

      totalCapacity: Number(
        data.totalCapacity
      ),

      supportedProducts:
        selectedProducts,

      status:
        data.status as DealerStatus,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-7"
    >
      <section>
        <h3 className="text-base font-semibold text-gray-900">
          Basic Information
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Dealer Name"
            error={
              errors.name?.message
            }
            {...register("name", {
              required:
                "Dealer name is required",
            })}
          />

          <Input
            label="Owner Name"
            error={
              errors.ownerName?.message
            }
            {...register("ownerName", {
              required:
                "Owner name is required",
            })}
          />

          <Input
            label="Email"
            type="email"
            error={
              errors.email?.message
            }
            {...register("email", {
              required:
                "Email is required",
            })}
          />

          <Input
            label="Phone"
            error={
              errors.phone?.message
            }
            {...register("phone", {
              required:
                "Phone is required",
            })}
          />
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-semibold text-gray-900">
          Address
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="City"
            error={
              errors.city?.message
            }
            {...register("city", {
              required:
                "City is required",
            })}
          />

          <Input
            label="State"
            error={
              errors.state?.message
            }
            {...register("state", {
              required:
                "State is required",
            })}
          />

          <Input
            label="Pincode"
            error={
              errors.pincode?.message
            }
            {...register("pincode", {
              required:
                "Pincode is required",
            })}
          />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>

            <textarea
              rows={3}
              {...register("address", {
                required:
                  "Address is required",
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.address && (
              <p className="mt-1 text-xs text-red-600">
                {
                  errors.address
                    .message
                }
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-semibold text-gray-900">
          Dealer Configuration
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Total Capacity"
            type="number"
            min={1}
            {...register(
              "totalCapacity",
              {
                required:
                  "Capacity is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message:
                    "Capacity must be greater than 0",
                },
              }
            )}
            error={
              errors.totalCapacity
                ?.message
            }
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
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
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Supported Products
          </label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(
              (product) => (
                <label
                  key={product}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(
                      product
                    )}
                    onChange={() =>
                      toggleProduct(
                        product
                      )
                    }
                  />

                  <span className="text-sm text-gray-700">
                    {product}
                  </span>
                </label>
              )
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}