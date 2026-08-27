import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  useAppSelector,
} from "../../../app/hooks";

import type {
  Item,
  ItemFormData,
} from "../types/item.types";

interface Props {
  item?: Item | null;

  loading?: boolean;

  onSubmit: (
    data: ItemFormData
  ) => void;

  onCancel: () => void;
}

export default function ItemForm({
  item,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const {
    categories,
  } =
    useAppSelector(
      (
        state
      ) =>
        state.category
    );

  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } =
    useForm<ItemFormData>(
      {
        defaultValues: {
          groupCategoryId:
            "",

          applicationCode:
            "",

          inventoryName: "",

          alternatePartNumber:
            "",

          description: "",

          specification: "",

          purchaseRate: 0,

          retailRate: 0,

          discountPercent: 0,

          openingStock: 0,

          currentStock: 0,

          hsnCode: "",

          taxRate: 0,

          uom: "",

          locked: false,

          itemDeactivated:
            false,

          kirloskarOrder:
            false,

          minimumLevel: 0,

          maximumLevel: 0,

          reorderLevel: 0,

          exciseApplicable:
            "NO",

          minimumOrderQuantity:
            1,

          underBectorFlow:
            false,

          length: 0,

          size: "",

          location: "",

          status: "ACTIVE",
        },
      }
    );

  useEffect(() => {
    if (!item) return;

    reset({
      ...item,
    });
  }, [
    item,
    reset,
  ]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      <Section title="Item Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <div>
            <label className={labelClass}>
              Group Category
            </label>

            <select
              {...register(
                "groupCategoryId",
                {
                  required:
                    "Group category is required",
                }
              )}
              className={inputClass}
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.groupCategoryCode
                    }{" "}
                    -{" "}
                    {
                      category.categoryDescription
                    }
                  </option>
                )
              )}
            </select>

            {errors.groupCategoryId && (
              <ErrorText>
                {
                  errors
                    .groupCategoryId
                    .message
                }
              </ErrorText>
            )}
          </div>

          <Input
            label="Application Code"
            {...register(
              "applicationCode"
            )}
          />

          <Input
            label="Inventory Name"
            error={
              errors.inventoryName
                ?.message
            }
            {...register(
              "inventoryName",
              {
                required:
                  "Inventory name is required",
              }
            )}
          />

          <Input
            label="Alt. Part No."
            {...register(
              "alternatePartNumber"
            )}
          />

          <Input
            label="Description"
            {...register(
              "description"
            )}
          />

          <Input
            label="Specification"
            {...register(
              "specification"
            )}
          />
        </div>
      </Section>

      <Section title="Pricing & Stock">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <Input
            label="Purchase Rate"
            type="number"
            step="0.01"
            {...register(
              "purchaseRate",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Retail Rate"
            type="number"
            step="0.01"
            {...register(
              "retailRate",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Discount %"
            type="number"
            step="0.01"
            {...register(
              "discountPercent",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Opening Stock"
            type="number"
            {...register(
              "openingStock",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Current Stock"
            type="number"
            {...register(
              "currentStock",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Minimum Order Quantity"
            type="number"
            {...register(
              "minimumOrderQuantity",
              {
                valueAsNumber:
                  true,
              }
            )}
          />
        </div>
      </Section>

      <Section title="Tax & UOM">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <Input
            label="HSN Code"
            {...register(
              "hsnCode"
            )}
          />

          <Input
            label="Tax Rate"
            type="number"
            step="0.01"
            {...register(
              "taxRate",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <div>
            <label className={labelClass}>
              UOM
            </label>

            <select
              {...register("uom")}
              className={inputClass}
            >
              <option value="">
                Select UOM
              </option>

              <option value="PCS">
                PCS
              </option>

              <option value="KG">
                KG
              </option>

              <option value="LTR">
                LTR
              </option>

              <option value="MTR">
                MTR
              </option>

              <option value="BOX">
                BOX
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Excise Applicable
            </label>

            <select
              {...register(
                "exciseApplicable"
              )}
              className={inputClass}
            >
              <option value="NO">
                No
              </option>

              <option value="YES">
                Yes
              </option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Inventory Levels">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <Input
            label="Minimum Level"
            type="number"
            {...register(
              "minimumLevel",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Maximum Level"
            type="number"
            {...register(
              "maximumLevel",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Reorder Level"
            type="number"
            {...register(
              "reorderLevel",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Length"
            type="number"
            step="0.01"
            {...register(
              "length",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Size"
            {...register(
              "size"
            )}
          />

          <Input
            label="Location"
            {...register(
              "location"
            )}
          />
        </div>
      </Section>

      <Section title="Item Settings">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Checkbox
            label="Locked"
            {...register(
              "locked"
            )}
          />

          <Checkbox
            label="Item Deactivated"
            {...register(
              "itemDeactivated"
            )}
          />

          <Checkbox
            label="Kirloskar Order"
            {...register(
              "kirloskarOrder"
            )}
          />

          <Checkbox
            label="Under Bector Flow"
            {...register(
              "underBectorFlow"
            )}
          />
        </div>

        <div className="mt-4 max-w-sm">
          <label className={labelClass}>
            Status
          </label>

          <select
            {...register("status")}
            className={inputClass}
          >
            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={
            onCancel
          }
          className="rounded-lg border px-5 py-2.5"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading
          }
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm text-white"
        >
          {loading
            ? "Saving..."
            : item
              ? "Update Item"
              : "Create Item"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold">
        {title}
      </h3>

      {children}
    </section>
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
      <label className={labelClass}>
        {label}
      </label>

      <input
        {...props}
        className={inputClass}
      />

      {error && (
        <ErrorText>
          {error}
        </ErrorText>
      )}
    </div>
  );
}

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Checkbox({
  label,
  ...props
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 rounded-lg border p-3">
      <input
        type="checkbox"
        {...props}
      />

      <span className="text-sm">
        {label}
      </span>
    </label>
  );
}

function ErrorText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-1 text-xs text-red-600">
      {children}
    </p>
  );
}

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
