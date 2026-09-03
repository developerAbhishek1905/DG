import { useEffect, useState } from "react";
import {
  getCategoryDropdown,
  type CategoryDropdown,
} from "../../categoryMaster/services/categoryApi";

import { useForm } from "react-hook-form";
import {
  useFieldArray,
  // useForm,
} from "react-hook-form";

import type { Dealer, DealerFormData } from "../types/dealer.types";
import { useAppSelector } from "../../../app/hooks";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  dealer?: Dealer;

  onSubmit: (data: DealerFormData) => Promise<void> | void;

  submitLabel?: string;
}

export default function DealerForm({
  dealer,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  // const { categories } = useAppSelector((state) => state.category);
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DealerFormData>({
    defaultValues: {
      technicianCode: dealer?.technicianCode ?? "",
      technicianFirmName: dealer?.technicianFirmName ?? "",
      technicianName: dealer?.technicianName ?? "",

      aadhaarNumber: dealer?.aadhaarNumber ?? "",

      alternativeNumber: dealer?.alternativeNumber ?? "",

      panNumber: dealer?.panNumber ?? "",

      drivingLicenceNumber: dealer?.drivingLicenceNumber ?? "",

      productId: dealer?.productId ?? "",
      productServiceType: dealer?.productServiceType ?? "",

      technicianStatus: dealer?.technicianStatus ?? "ACTIVE",
      headCode: dealer?.headCode ?? "",

      groupHead: dealer?.groupHead ?? "",

      headName: dealer?.headName ?? "",

      grade: dealer?.grade ?? "",

      address: dealer?.address?.length
        ? dealer.address
        : [
            {
              addressLine: "",
            },
          ],

      city: dealer?.city ?? "",

      district: dealer?.district ?? "",

      state: dealer?.state ?? "",

      stateCode: dealer?.stateCode ?? "",

      pinCode: dealer?.pinCode ?? "",

      zone: dealer?.zone ?? "",

      contactPerson: dealer?.contactPerson ?? "",

      phoneNumbers: dealer?.phoneNumbers ?? "",

      mobileNumber: dealer?.mobileNumber ?? "",

      email: dealer?.email ?? "",

      taxApply: dealer?.taxApply ?? "",

      gstNumber: dealer?.gstNumber ?? "",

      tinNumber: dealer?.tinNumber ?? "",

      uinNumber: dealer?.uinNumber ?? "",

      gstApplicable: dealer?.gstApplicable ?? "",

      gstRate: dealer?.gstRate ?? 0,

      hsnCode: dealer?.hsnCode ?? "",

      reverseChargeLimit: dealer?.reverseChargeLimit ?? 0,

      taxInputPayable: dealer?.taxInputPayable ?? "",

      vat15Column: dealer?.vat15Column ?? "",

      segment: dealer?.segment ?? "",

      creditDays: dealer?.creditDays ?? 0,

      creditLimit: dealer?.creditLimit ?? 0,

      accountType: dealer?.accountType ?? "STANDARD",

      isDealer: dealer?.isDealer ?? true,

      disableChallan: dealer?.disableChallan ?? false,

      ledgerSummaryOnly: dealer?.ledgerSummaryOnly ?? false,

      accountDeactivated: dealer?.accountDeactivated ?? false,

      otherInfo: dealer?.otherInfo ?? "",

      rating: dealer?.rating ?? 0,

      openingBalance: dealer?.openingBalance ?? 0,

      openingBalanceType: dealer?.openingBalanceType ?? "DR",

      capacityMaster: dealer?.capacityMaster?.length
        ? dealer.capacityMaster
        : [
            {
              categoryId: "",
              rate: 0,
              capacity: 0,
              serviceType: "",
            },
          ],
    },
  });

  const {
    fields: capacityFields,
    append: appendCapacity,
    remove: removeCapacity,
  } = useFieldArray({
    control,
    name: "capacityMaster",
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "address",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getCategoryDropdown();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);

        setCategoriesError("Unable to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!dealer) {
      return;
    }

    reset({
      technicianCode: dealer.technicianCode ?? "",
      technicianFirmName: dealer.technicianFirmName ?? "",
      technicianName: dealer.technicianName ?? "",

      aadhaarNumber: dealer.aadhaarNumber ?? "",

      alternativeNumber: dealer.alternativeNumber ?? "",

      panNumber: dealer.panNumber ?? "",

      drivingLicenceNumber: dealer.drivingLicenceNumber ?? "",

      productId: dealer.productId ?? "",
      productServiceType: dealer.productServiceType ?? "",

      technicianStatus: dealer.technicianStatus ?? "ACTIVE",
      headCode: dealer.headCode,

      groupHead: dealer.groupHead,

      headName: dealer.headName,

      grade: dealer.grade ?? "",

      address: dealer.address ?? "",

      city: dealer.city ?? "",

      district: dealer.district ?? "",

      state: dealer.state ?? "",

      stateCode: dealer.stateCode ?? "",

      pinCode: dealer.pinCode ?? "",

      zone: dealer.zone ?? "",

      contactPerson: dealer.contactPerson ?? "",

      phoneNumbers: dealer.phoneNumbers ?? "",

      mobileNumber: dealer.mobileNumber ?? "",

      email: dealer.email ?? "",

      taxApply: dealer.taxApply ?? "",

      gstNumber: dealer.gstNumber ?? "",

      tinNumber: dealer.tinNumber ?? "",

      uinNumber: dealer.uinNumber ?? "",

      gstApplicable: dealer.gstApplicable ?? "",

      gstRate: dealer.gstRate ?? 0,

      hsnCode: dealer.hsnCode ?? "",

      reverseChargeLimit: dealer.reverseChargeLimit ?? 0,

      taxInputPayable: dealer.taxInputPayable ?? "",

      vat15Column: dealer.vat15Column ?? "",

      segment: dealer.segment ?? "",

      creditDays: dealer.creditDays ?? 0,

      creditLimit: dealer.creditLimit ?? 0,

      accountType: dealer.accountType,

      isDealer: dealer.isDealer,

      disableChallan: dealer.disableChallan,

      ledgerSummaryOnly: dealer.ledgerSummaryOnly,

      accountDeactivated: dealer.accountDeactivated,

      otherInfo: dealer.otherInfo ?? "",

      rating: dealer.rating ?? 0,

      openingBalance: dealer.openingBalance ?? 0,

      openingBalanceType: dealer.openingBalanceType,
      capacityType: dealer?.capacityType ?? "INDIVIDUAL",

      capacityMaster: dealer.capacityMaster?.length
        ? dealer.capacityMaster
        : [
            {
              categoryId: "",
              rate: 0,
              capacity: 0,
              serviceType: "",
            },
          ],
    });
  }, [dealer, reset]);

  const selectedCapacityCategories = watch("capacityMaster") || [];
  const capacityType = watch("capacityType");

const combinedCategoryNames = [
  "washing machine",
  "refrigerator",
  "microwave",
];

const combinedCategories = categories.filter((category) => {
  const value =
    `${category.category} ${category.categoryDescription}`.toLowerCase();

  return combinedCategoryNames.some((name) => value.includes(name));
});

const handleCapacityTypeChange = (
  type: "COMBINED" | "INDIVIDUAL",
) => {
  setValue("capacityType", type);

  setValue("capacityMaster", [
    {
      categoryId: "",
      rate: 0,
      capacity: 0,
      serviceType: "",
    },
  ]);
};

  const submitForm = async (data: DealerFormData) => {
    await onSubmit({
      ...data,

      gstRate: Number(data.gstRate || 0),

      reverseChargeLimit: Number(data.reverseChargeLimit || 0),

      creditDays: Number(data.creditDays || 0),

      creditLimit: Number(data.creditLimit || 0),

      rating: Number(data.rating || 0),

      openingBalance: Number(data.openingBalance || 0),

      capacityMaster: data.capacityMaster.map((item) => ({
        categoryId: item.categoryId,

        rate: Number(item.rate),

        capacity: Number(item.capacity),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-7">
      <Section title="Basic Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Head Code"
            error={errors.headCode?.message}
            {...register("headCode", {
              required: "Head code is required",
            })}
          />

          {/* <div>
            <label className={labelClass}>Group Head</label>

            <select
              {...register("groupHead", {
                required: "Group head is required",
              })}
              className={inputClass}
            >
              <option value="">Select Group Head</option>

              <option value="SUNDRY_DEBTORS">Sundry Debtors</option>

              <option value="SUNDRY_CREDITORS">Sundry Creditors</option>

              <option value="SALES">Sales</option>

              <option value="PURCHASE">Purchase</option>

              <option value="EXPENSE">Expense</option>
            </select>

            {errors.groupHead && (
              <ErrorText>{errors.groupHead.message}</ErrorText>
            )}
          </div> */}

          <Input
            label="Head Name"
            error={errors.headName?.message}
            {...register("headName", {
              required: "Head name is required",
            })}
          />

          <Input label="Grade" {...register("grade")} />

          <Input label="Segment" {...register("segment")} />
        </div>
      </Section>

      <Section title="Technician Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* <Input
            label="Technician Code"
            placeholder="Auto Generated"
            readOnly
            {...register("technicianCode")}
          /> */}

          <Input
            label="Technician Firm Name"
            placeholder="Enter technician firm name"
            error={errors.technicianFirmName?.message}
            {...register("technicianFirmName", {
              required: "Technician firm name is required",
            })}
          />

          <Input
            label="Technician Name"
            placeholder="Enter technician name"
            error={errors.technicianName?.message}
            {...register("technicianName", {
              required: "Technician name is required",
            })}
          />

          <Input
            label="Phone Number"
            maxLength={10}
            inputMode="numeric"
            placeholder="Enter phone number"
            error={errors.mobileNumber?.message}
            {...register("mobileNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9][0-9]{9}$/,
                message: "Enter valid 10 digit phone number",
              },
            })}
          />

          <Input
            label="Alternative Number"
            maxLength={10}
            inputMode="numeric"
            placeholder="Enter alternative number"
            error={errors.alternativeNumber?.message}
            {...register("alternativeNumber", {
              pattern: {
                value: /^$|^[6-9][0-9]{9}$/,
                message: "Enter valid 10 digit alternative number",
              },
            })}
          />

          <Input
            label="Email ID"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter valid email address",
              },
            })}
          />

          <div>
            <label className={labelClass}>Status</label>

            <select
              {...register("technicianStatus", {
                required: "Status is required",
              })}
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Deactive</option>
            </select>

            {errors.technicianStatus && (
              <ErrorText>{errors.technicianStatus.message}</ErrorText>
            )}
          </div>
        </div>
      </Section>

      <Section title="Address Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Address</label>

            <textarea
              rows={3}
              placeholder="Enter complete address"
              {...register("address", {
                required: "Address is required",
              })}
              className={textareaClass}
            />

            {errors.address && <ErrorText>{errors.address.message}</ErrorText>}
          </div> */}

          <div className="md:col-span-2 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <label className={labelClass}>Address</label>

              <button
                type="button"
                onClick={() =>
                  appendAddress({
                    addressLine: "",
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-3 py-2 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>

            <div className="space-y-4">
              {addressFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      placeholder={`Enter address ${index + 1}`}
                      {...register(`address.${index}.addressLine`, {
                        required: "Address is required",
                      })}
                      className={textareaClass}
                    />

                    {errors.address?.[index]?.addressLine && (
                      <ErrorText>
                        {errors.address[index]?.addressLine?.message}
                      </ErrorText>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={addressFields.length === 1}
                    onClick={() => removeAddress(index)}
                    className="mt-1 inline-flex h-[42px] items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Remove Address"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Input
            label="City"
            error={errors.city?.message}
            {...register("city", {
              required: "City is required",
            })}
          />

          <Input label="District" {...register("district")} />

          <Input
            label="State"
            error={errors.state?.message}
            {...register("state", {
              required: "State is required",
            })}
          />

          <Input label="State Code" {...register("stateCode")} />

          <Input
            label="PIN Code"
            maxLength={6}
            inputMode="numeric"
            error={errors.pinCode?.message}
            {...register("pinCode", {
              required: "PIN code is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter valid 6 digit PIN code",
              },
            })}
          />

          <Input label="Zone" {...register("zone")} />
        </div>
      </Section>

      <Section title="Identity & Documents">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Aadhaar Number */}
          <Input
            label="Aadhaar Card Number"
            maxLength={12}
            inputMode="numeric"
            placeholder="Enter 12 digit Aadhaar number"
            error={errors.aadhaarNumber?.message}
            {...register("aadhaarNumber", {
              required: "Aadhaar number is required",
              pattern: {
                value: /^[0-9]{12}$/,
                message: "Enter valid 12 digit Aadhaar number",
              },
            })}
          />

          {/* Aadhaar File */}
          <div>
            <label className={labelClass}>Upload Aadhaar Card</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("aadhaarFile", {
                required: !dealer ? "Aadhaar document is required" : false,
              })}
              className={inputClass}
            />

            {errors.aadhaarFile && (
              <ErrorText>{errors.aadhaarFile.message as string}</ErrorText>
            )}
          </div>

          {/* PAN Number */}
          <Input
            label="PAN Card Number"
            maxLength={10}
            placeholder="ABCDE1234F"
            error={errors.panNumber?.message}
            {...register("panNumber", {
              required: "PAN card number is required",
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Enter valid PAN number",
              },
              onChange: (event) => {
                event.target.value = event.target.value.toUpperCase();
              },
            })}
          />

          {/* PAN File */}
          <div>
            <label className={labelClass}>Upload PAN Card</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("panFile", {
                required: !dealer ? "PAN document is required" : false,
              })}
              className={inputClass}
            />

            {errors.panFile && (
              <ErrorText>{errors.panFile.message as string}</ErrorText>
            )}
          </div>

          {/* Driving Licence */}
          <Input
            label="Driving Licence Number"
            placeholder="Enter driving licence number"
            error={errors.drivingLicenceNumber?.message}
            {...register("drivingLicenceNumber", {
              required: "Driving licence number is required",
            })}
          />

          {/* Driving Licence File */}
          <div>
            <label className={labelClass}>Upload Driving Licence</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("drivingLicenceFile", {
                required: !dealer
                  ? "Driving licence document is required"
                  : false,
              })}
              className={inputClass}
            />

            {errors.drivingLicenceFile && (
              <ErrorText>
                {errors.drivingLicenceFile.message as string}
              </ErrorText>
            )}
          </div>

          {/* Other Document */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Other Document Upload</label>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("documentUpload")}
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG and PDF files are allowed.
            </p>
          </div>
        </div>
      </Section>

      {/* <Section title="Contact Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input label="Contact Person" {...register("contactPerson")} />

          <Input label="Phone Nos." {...register("phoneNumbers")} />

          <Input
            label="Mobile No."
            maxLength={10}
            inputMode="numeric"
            {...register("mobileNumber")}
          />

          <Input label="Email" type="email" {...register("email")} />
        </div>
      </Section> */}

      <Section title="Tax Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Tax Apply</label>

            <select {...register("taxApply")} className={inputClass}>
              <option value="">Select</option>

              <option value="WITHIN_STATE">Within State</option>

              <option value="OUTSIDE_STATE">Outside State</option>
            </select>
          </div>

          <Input label="GST No." {...register("gstNumber")} />

          <Input label="TIN No." {...register("tinNumber")} />

          <Input label="UIN No." {...register("uinNumber")} />

          <Input label="PAN No." {...register("panNumber")} />

          <div>
            <label className={labelClass}>GST Applicable</label>

            <select {...register("gstApplicable")} className={inputClass}>
              <option value="">Select</option>

              <option value="YES">Yes</option>

              <option value="NO">No</option>
            </select>
          </div>

          <Input
            label="GST Rate"
            type="number"
            min={0}
            step="0.01"
            {...register("gstRate", {
              valueAsNumber: true,
            })}
          />

          <Input label="HSN Code" {...register("hsnCode")} />

          <Input
            label="Limit of Reverse Charges"
            type="number"
            min={0}
            {...register("reverseChargeLimit", {
              valueAsNumber: true,
            })}
          />

          <div>
            <label className={labelClass}>Tax Input / Payable</label>

            <select {...register("taxInputPayable")} className={inputClass}>
              <option value="">Select</option>

              <option value="INPUT">Input</option>

              <option value="PAYABLE">Payable</option>
            </select>
          </div>

          <Input label="Column Form VAT-15" {...register("vat15Column")} />
        </div>
      </Section>

      <Section title="Credit Information">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Credit Days"
            type="number"
            min={0}
            {...register("creditDays", {
              valueAsNumber: true,
            })}
          />

          <Input
            label="Credit Limit"
            type="number"
            min={0}
            {...register("creditLimit", {
              valueAsNumber: true,
            })}
          />
        </div>
      </Section>

      <Section title="Account Configuration">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Account Type
          </label>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Radio
              label="Standard"
              value="STANDARD"
              {...register("accountType")}
            />

            <Radio
              label="As Other Expenses in Invoice"
              value="OTHER_EXPENSE_IN_INVOICE"
              {...register("accountType")}
            />

            <Radio label="Bank" value="BANK" {...register("accountType")} />

            <Radio
              label="Tax Code"
              value="TAX_CODE"
              {...register("accountType")}
            />

            <Radio
              label="Sale / Purchase Account"
              value="SALE_PURCHASE_ACCOUNT"
              {...register("accountType")}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Checkbox label="Dealer" {...register("isDealer")} />

            <Checkbox label="Disable Challan" {...register("disableChallan")} />

            <Checkbox
              label="Ledger Summary Only"
              {...register("ledgerSummaryOnly")}
            />

            <Checkbox
              label="Account Deactivated"
              {...register("accountDeactivated")}
            />
          </div>
        </div>
      </Section>

      <Section title="Opening Balance & Other Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Rating"
            type="number"
            min={0}
            {...register("rating", {
              valueAsNumber: true,
            })}
          />

          <Input
            label="Opening Balance"
            type="number"
            step="0.01"
            {...register("openingBalance", {
              valueAsNumber: true,
            })}
          />

          <div>
            <label className={labelClass}>Balance Type</label>

            <select {...register("openingBalanceType")} className={inputClass}>
              <option value="DR">Debit (Dr)</option>

              <option value="CR">Credit (Cr)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Other Info.</label>

            <textarea
              rows={3}
              {...register("otherInfo")}
              className={textareaClass}
            />
          </div>
        </div>
      </Section>

      <Section title="Product & Service Information">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Product</label>

            <select
              {...register("productId", {
                required: "Product is required",
              })}
              className={inputClass}
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? "Loading products..." : "Select Product"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.groupCategoryCode} - {category.categoryDescription}
                </option>
              ))}
            </select>

            {categoriesError && <ErrorText>{categoriesError}</ErrorText>}

            {errors.productId && (
              <ErrorText>{errors.productId.message}</ErrorText>
            )}
          </div>

          <div>
            <label className={labelClass}>Product Service Type</label>

            <select
              {...register("productServiceType", {
                required: "Product service type is required",
              })}
              className={inputClass}
            >
              <option value="">Select Service Type</option>
              <option value="INSTALLATION">Installation</option>
              <option value="SERVICE">Service</option>
              <option value="REPAIR">Repair</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UNINSTALLATION">Uninstallation</option>
            </select>

            {errors.productServiceType && (
              <ErrorText>{errors.productServiceType.message}</ErrorText>
            )}
          </div>
        </div>
      </Section>

<Section title="Capacity Master">
  <div className="space-y-6">

    {/* ============================= */}
    {/* CAPACITY TYPE */}
    {/* ============================= */}

    <div>
      <label className={labelClass}>Capacity Type</label>

      <div className="mt-2 flex flex-wrap gap-4">
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
            capacityType === "COMBINED"
              ? "border-[#123B7A] bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <input
            type="radio"
            value="COMBINED"
            checked={capacityType === "COMBINED"}
            onChange={() => handleCapacityTypeChange("COMBINED")}
          />

          <div>
            <p className="text-sm font-medium text-gray-900">
              Combined Capacity
            </p>

            <p className="text-xs text-gray-500">
              Washing Machine + Refrigerator + Microwave
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
            capacityType === "INDIVIDUAL"
              ? "border-[#123B7A] bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <input
            type="radio"
            value="INDIVIDUAL"
            checked={capacityType === "INDIVIDUAL"}
            onChange={() => handleCapacityTypeChange("INDIVIDUAL")}
          />

          <div>
            <p className="text-sm font-medium text-gray-900">
              Individual Capacity
            </p>

            <p className="text-xs text-gray-500">
              Separate capacity for each category
            </p>
          </div>
        </label>
      </div>

      {errors.capacityType && (
        <ErrorText>{errors.capacityType.message}</ErrorText>
      )}
    </div>

    {/* ====================================================== */}
    {/* COMBINED CAPACITY */}
    {/* ====================================================== */}

    {capacityType === "COMBINED" && (
      <div className="space-y-5">

        {/* Combined Categories */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-900">
              Combined Categories
            </p>

            <p className="mt-1 text-xs text-gray-600">
              The capacity entered below will be shared between these
              categories.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {combinedCategories.length > 0 ? (
              combinedCategories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-[#123B7A]"
                >
                  {category.groupCategoryCode} -{" "}
                  {category.categoryDescription}
                </span>
              ))
            ) : (
              <>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
                  Washing Machine
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
                  Refrigerator
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
                  Microwave
                </span>
              </>
            )}
          </div>
        </div>

        {/* Combined Fields */}

        <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-3">

          {/* Service Type */}
          <div>
            <label className={labelClass}>
              Service Type
            </label>

            <select
              {...register("capacityMaster.0.serviceType", {
                required: "Service type is required",
              })}
              className={inputClass}
            >
              <option value="">Select Service Type</option>

              <option value="INSTALLATION">
                Installation
              </option>

              <option value="SERVICE">
                Service
              </option>

              <option value="REPAIR">
                Repair
              </option>

              <option value="MAINTENANCE">
                Maintenance
              </option>

              <option value="UNINSTALLATION">
                Uninstallation
              </option>
            </select>

            {errors.capacityMaster?.[0]?.serviceType && (
              <ErrorText>
                {
                  errors.capacityMaster[0]?.serviceType
                    ?.message
                }
              </ErrorText>
            )}
          </div>

          {/* Rate */}
          <div>
            <label className={labelClass}>
              Rate
            </label>

            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="Enter rate"
              {...register("capacityMaster.0.rate", {
                required: "Rate is required",

                valueAsNumber: true,

                min: {
                  value: 0,
                  message: "Rate cannot be negative",
                },
              })}
              className={inputClass}
            />

            {errors.capacityMaster?.[0]?.rate && (
              <ErrorText>
                {errors.capacityMaster[0]?.rate?.message}
              </ErrorText>
            )}
          </div>

          {/* Combined Capacity */}
          <div>
            <label className={labelClass}>
              Combined Capacity
            </label>

            <input
              type="number"
              min={1}
              placeholder="Enter combined capacity"
              {...register("capacityMaster.0.capacity", {
                required: "Capacity is required",

                valueAsNumber: true,

                min: {
                  value: 1,
                  message:
                    "Capacity must be greater than 0",
                },
              })}
              className={inputClass}
            />

            {errors.capacityMaster?.[0]?.capacity && (
              <ErrorText>
                {
                  errors.capacityMaster[0]?.capacity
                    ?.message
                }
              </ErrorText>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            Example: If combined capacity is 10, Washing
            Machine, Refrigerator and Microwave together can
            handle maximum 10 jobs. It does not mean 10 jobs
            for each category.
          </p>
        </div>
      </div>
    )}

    {/* ====================================================== */}
    {/* INDIVIDUAL CAPACITY */}
    {/* ====================================================== */}

    {capacityType === "INDIVIDUAL" && (
      <div className="space-y-4">

        {/* Header */}

        <div className="hidden grid-cols-[2fr_1.3fr_1fr_1fr_auto] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
          <div>Category</div>

          <div>Service Type</div>

          <div>Rate</div>

          <div>Capacity</div>

          <div>Action</div>
        </div>

        {/* Rows */}

        {capacityFields.map((field, index) => {
          const selectedCategoryId = watch(
            `capacityMaster.${index}.categoryId`,
          );

          return (
            <div
              key={field.id}
              className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[2fr_1.3fr_1fr_1fr_auto] md:items-end"
            >

              {/* CATEGORY */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 md:hidden">
                  Category
                </label>

                <select
                  {...register(
                    `capacityMaster.${index}.categoryId`,
                    {
                      required: "Category is required",
                    },
                  )}
                  className={inputClass}
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

                  {categories
                    .filter((category) => {
                      const alreadySelected =
                        selectedCapacityCategories.some(
                          (item, itemIndex) =>
                            itemIndex !== index &&
                            item.categoryId ===
                              category.id,
                        );

                      return !alreadySelected;
                    })
                    .map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.groupCategoryCode} -{" "}
                        {category.categoryDescription}
                      </option>
                    ))}
                </select>

                {errors.capacityMaster?.[index]
                  ?.categoryId && (
                  <ErrorText>
                    {
                      errors.capacityMaster[index]
                        ?.categoryId?.message
                    }
                  </ErrorText>
                )}
              </div>

              {/* SERVICE TYPE */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 md:hidden">
                  Service Type
                </label>

                <select
                  {...register(
                    `capacityMaster.${index}.serviceType`,
                    {
                      required:
                        "Service type is required",
                    },
                  )}
                  className={inputClass}
                >
                  <option value="">
                    Select Service Type
                  </option>

                  <option value="INSTALLATION">
                    Installation
                  </option>

                  <option value="SERVICE">
                    Service
                  </option>

                  <option value="REPAIR">
                    Repair
                  </option>

                  <option value="MAINTENANCE">
                    Maintenance
                  </option>

                  <option value="UNINSTALLATION">
                    Uninstallation
                  </option>
                </select>

                {errors.capacityMaster?.[index]
                  ?.serviceType && (
                  <ErrorText>
                    {
                      errors.capacityMaster[index]
                        ?.serviceType?.message
                    }
                  </ErrorText>
                )}
              </div>

              {/* RATE */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 md:hidden">
                  Rate
                </label>

                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0"
                  {...register(
                    `capacityMaster.${index}.rate`,
                    {
                      required: "Rate is required",

                      valueAsNumber: true,

                      min: {
                        value: 0,
                        message:
                          "Rate cannot be negative",
                      },
                    },
                  )}
                  className={inputClass}
                />

                {errors.capacityMaster?.[index]?.rate && (
                  <ErrorText>
                    {
                      errors.capacityMaster[index]
                        ?.rate?.message
                    }
                  </ErrorText>
                )}
              </div>

              {/* CAPACITY */}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 md:hidden">
                  Capacity
                </label>

                <input
                  type="number"
                  min={1}
                  placeholder="0"
                  {...register(
                    `capacityMaster.${index}.capacity`,
                    {
                      required: "Capacity is required",

                      valueAsNumber: true,

                      min: {
                        value: 1,
                        message:
                          "Capacity must be greater than 0",
                      },
                    },
                  )}
                  className={inputClass}
                />

                {errors.capacityMaster?.[index]
                  ?.capacity && (
                  <ErrorText>
                    {
                      errors.capacityMaster[index]
                        ?.capacity?.message
                    }
                  </ErrorText>
                )}
              </div>

              {/* REMOVE */}

              <div>
                <button
                  type="button"
                  disabled={capacityFields.length === 1}
                  onClick={() => removeCapacity(index)}
                  className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                >
                  <Trash2 size={16} />

                  <span className="md:hidden">
                    Remove
                  </span>
                </button>
              </div>
            </div>
          );
        })}

        {/* ADD CATEGORY */}

        <div className="flex justify-start">
          <button
            type="button"
            onClick={() =>
              appendCapacity({
                categoryId: "",
                serviceType: "",
                rate: 0,
                capacity: 0,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
          >
            <Plus size={17} />

            Add Category
          </button>
        </div>
      </div>
    )}
  </div>
</Section>

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
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
    <section className="border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      <div className="mt-4">{children}</div>
    </section>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <input {...props} className={inputClass} />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
      <input {...props} type="checkbox" />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Radio({ label, ...props }: RadioProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
      <input {...props} type="radio" />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
