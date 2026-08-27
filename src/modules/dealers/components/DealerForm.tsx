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