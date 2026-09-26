import { useEffect, useState } from "react";
import {
  searchProducts,
  type ProductDropdownOption,
} from "../services/dealerApi";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { Dealer, DealerFormData } from "../types/dealer.types";
import AddressFields from "../components/AddressFields";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import ProductServiceFields from "../components/ProductServiceFields";
import SearchSelect from "../../../components/ui/SearchSelect";
type DealerFormTab = "basic" | "documents" | "account" | "service";
import type { FieldErrors } from "react-hook-form";
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
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState("");
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState("");
  const [panFrontPreview, setPanFrontPreview] = useState("");
  const [panBackPreview, setPanBackPreview] = useState("");
  const [drivingFrontPreview, setDrivingFrontPreview] = useState("");
  const [drivingBackPreview, setDrivingBackPreview] = useState("");
  const [
    ,
    // otherDocuments
    setOtherDocuments,
  ] = useState<File[]>([]);

  const [capacityProducts, setCapacityProducts] = useState<
    ProductDropdownOption[]
  >([]);

  const [capacityProductsLoading, setCapacityProductsLoading] = useState(false);
  const [otherDocumentPreviews, setOtherDocumentPreviews] = useState<
    {
      name: string;
      type: string;
      url: string;
    }[]
  >([]);
  const [activeTab, setActiveTab] = useState<DealerFormTab>("basic");
  const dealerTabs: {
    id: DealerFormTab;
    label: string;
    number: number;
    mobileLabel: string;
  }[] = [
    {
      id: "basic",
      label: "Basic & Address",
      mobileLabel: "Basic",
      number: 1,
    },
    {
      id: "documents",
      label: "Identity & Documents",
      mobileLabel: "Documents",
      number: 2,
    },
    {
      id: "account",
      label: "Tax & Account",
      mobileLabel: "Tax",
      number: 3,
    },
    {
      id: "service",
      label: "Product & Capacity",
      mobileLabel: "Product",
      number: 4,
    },
  ];

  const loadCapacityProducts = async (search = "") => {
    try {
      setCapacityProductsLoading(true);
      const data = await searchProducts(search);
      setCapacityProducts(data);
    } catch (error) {
      console.error("Failed to load capacity products:", error);
      setCapacityProducts([]);
    } finally {
      setCapacityProductsLoading(false);
    }
  };

  useEffect(() => {
    loadCapacityProducts("");
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
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
      billingType: dealer?.billingType ?? "FIXED",
      billingPercentage: dealer?.billingPercentage ?? 0,
      cancellationBillingEnabled: dealer?.cancellationBillingEnabled ?? false,
      cancellationCharge: dealer?.cancellationCharge ?? 0,
      drivingLicenceNumber: dealer?.drivingLicenceNumber ?? "",
      // productServices: dealer?.productServices?.length
      //   ? dealer.productServices
      //   : [
      //       {
      //         productId: undefined,
      //         productName: "",
      //         categories: [],
      //       },
      //     ],
      productServices: dealer?.productServices?.length
        ? dealer.productServices
        : [],
      technicianStatus: dealer?.technicianStatus ?? "ACTIVE",
      headCode: dealer?.headCode ?? "",
      groupHead: dealer?.groupHead ?? "",
      headName: dealer?.headName ?? "SUNDRY DEBTORS",
      grade: dealer?.grade ?? "",
      businessAddress: {
        addressLine: dealer?.businessAddress?.addressLine ?? "",
        stateId: dealer?.businessAddress?.stateId ?? undefined,
        state: dealer?.businessAddress?.state ?? "",
        stateCode: dealer?.businessAddress?.stateCode ?? "",
        districtId: dealer?.businessAddress?.districtId ?? undefined,
        district: dealer?.businessAddress?.district ?? "",
        cityId: dealer?.businessAddress?.cityId ?? undefined,
        city: dealer?.businessAddress?.city ?? "",
        pinCode: dealer?.businessAddress?.pinCode ?? "",
      },
      residentialAddress: {
        addressLine: dealer?.residentialAddress?.addressLine ?? "",
        stateId: dealer?.residentialAddress?.stateId ?? undefined,
        state: dealer?.residentialAddress?.state ?? "",
        stateCode: dealer?.residentialAddress?.stateCode ?? "",
        districtId: dealer?.residentialAddress?.districtId ?? undefined,
        district: dealer?.residentialAddress?.district ?? "",
        cityId: dealer?.residentialAddress?.cityId ?? undefined,
        city: dealer?.residentialAddress?.city ?? "",
        pinCode: dealer?.residentialAddress?.pinCode ?? "",
      },
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
      combinedCapacity: dealer?.combinedCapacity ?? {
        products: [],
        capacity: 0,
      },
      dateOfJoining: dealer?.dateOfJoining
        ? new Date(dealer.dateOfJoining).toISOString().split("T")[0]
        : "",

      dateOfLeaving: dealer?.dateOfLeaving
        ? new Date(dealer.dateOfLeaving).toISOString().split("T")[0]
        : "",
      // individualCapacities: dealer?.individualCapacities?.length
      //   ? dealer.individualCapacities.map((item) => ({
      //       productId: Number(item.productId),
      //       productName: item.productName ?? "",
      //       capacity: Number(item.capacity ?? 0),
      //     }))
      //   : [
      //       {
      //         productId: undefined,
      //         productName: "",
      //         capacity: 0,
      //       },
      //     ],

      individualCapacities: dealer?.individualCapacities?.length
        ? dealer.individualCapacities.map((item) => ({
            productId: Number(item.productId),
            productName: item.productName ?? "",
            capacity: Number(item.capacity ?? 0),
          }))
        : [],

      securityAmount: dealer?.securityAmount ?? 0,

      additionalInfo: dealer?.additionalInfo?.length
        ? dealer.additionalInfo
        : [],
    },
  });

  const {
    fields: additionalInfoFields,
    append: addAdditionalInfo,
    remove: removeAdditionalInfo,
  } = useFieldArray({
    control,
    name: "additionalInfo",
  });

  const {
    fields: individualCapacityFields,
    append: appendIndividualCapacity,
    remove: removeIndividualCapacity,
  } = useFieldArray({
    control,
    name: "individualCapacities",
  });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: "productServices",
  });

  console.log(dealer);
  useEffect(() => {
    if (!dealer) {
      return;
    }

    reset({
      billingType: dealer.billingType ?? "FIXED",
      billingPercentage: dealer.billingPercentage ?? 0,
      cancellationBillingEnabled: dealer.cancellationBillingEnabled ?? false,
      cancellationCharge: dealer.cancellationCharge ?? 0,
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
      businessAddress: {
        addressLine: dealer.businessAddress?.addressLine ?? "",
        stateId:
          dealer.businessAddress?.stateId !== undefined
            ? Number(dealer.businessAddress.stateId)
            : undefined,
        state: dealer.businessAddress?.state ?? "",
        stateCode: dealer.businessAddress?.stateCode ?? "",
        districtId:
          dealer.businessAddress?.districtId !== undefined
            ? Number(dealer.businessAddress.districtId)
            : undefined,
        district: dealer.businessAddress?.district ?? "",
        cityId:
          dealer.businessAddress?.cityId !== undefined
            ? Number(dealer.businessAddress.cityId)
            : undefined,
        city: dealer.businessAddress?.city ?? "",
        pinCode: dealer.businessAddress?.pinCode ?? "",
      },

      residentialAddress: {
        addressLine: dealer.residentialAddress?.addressLine ?? "",
        stateId:
          dealer.residentialAddress?.stateId !== undefined
            ? Number(dealer.residentialAddress.stateId)
            : undefined,
        state: dealer.residentialAddress?.state ?? "",
        stateCode: dealer.residentialAddress?.stateCode ?? "",
        districtId:
          dealer.residentialAddress?.districtId !== undefined
            ? Number(dealer.residentialAddress.districtId)
            : undefined,
        district: dealer.residentialAddress?.district ?? "",
        cityId:
          dealer.residentialAddress?.cityId !== undefined
            ? Number(dealer.residentialAddress.cityId)
            : undefined,
        city: dealer.residentialAddress?.city ?? "",
        pinCode: dealer.residentialAddress?.pinCode ?? "",
      },
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
      productServices:
        dealer.productServices?.map((product: any) => ({
          productId: product.productId,
          productName: product.productName,
          categories:
            product.categories?.map((category: any) => ({
              categoryId: category.categoryId ?? category._id ?? category.id,
              categoryName:
                category.categoryName ??
                category.category ??
                category.category_name,
              description: category.description ?? "",
              rate: Number(category.rate ?? 0),
            })) ?? [],
        })) ?? [],

      openingBalanceType: dealer.openingBalanceType,
      combinedCapacity: dealer?.combinedCapacity ?? {
        products: [],
        capacity: 0,
      },
      dateOfJoining: dealer.dateOfJoining
        ? new Date(dealer.dateOfJoining).toISOString().split("T")[0]
        : "",

      dateOfLeaving: dealer.dateOfLeaving
        ? new Date(dealer.dateOfLeaving).toISOString().split("T")[0]
        : "",
      capacityMaster: dealer?.capacityMaster?.length
        ? dealer.capacityMaster
        : [
            {
              productId: undefined,
              productName: "",
              capacity: 0,
            },
          ],
      individualCapacities: dealer?.individualCapacities?.length
        ? dealer.individualCapacities.map((item) => ({
            productId: Number(item.productId),
            productName: item.productName ?? "",
            capacity: Number(item.capacity ?? 0),
          }))
        : [
            {
              productId: undefined,
              productName: "",
              capacity: 0,
            },
          ],
      securityAmount: dealer.securityAmount ?? 0,

      additionalInfo: dealer.additionalInfo?.length
        ? dealer.additionalInfo
        : [],
    });
  }, [dealer, reset]);

  const combinedCapacityProducts = watch("combinedCapacity.products") || [];
  const individualCapacities = watch("individualCapacities") || [];

  // Product IDs already selected in Combined Capacity
const combinedProductIds = combinedCapacityProducts.map((item) =>
  Number(item.productId),
);

// Don't show Combined Capacity products in Individual Capacity
const availableIndividualProducts = capacityProducts.filter(
  (product) =>
    !combinedProductIds.includes(Number(product.product_id)),
);

  const createSingleFilePreview = (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = files?.[0];

    if (!file) {
      setter("");
      return;
    }

    if (file.type.startsWith("image/")) {
      setter(URL.createObjectURL(file));
    } else {
      setter("");
    }
  };

  const handleOtherDocuments = (files: FileList | null) => {
    if (!files) return;
    const selectedFiles = Array.from(files);
    if (selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 documents.");
      return;
    }

    setOtherDocuments(selectedFiles);
    const previews = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));

    setOtherDocumentPreviews(previews);
  };

  const removeOtherDocument = (index: number) => {
    setOtherDocumentPreviews((prev) => {
      const removed = prev[index];
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
    setOtherDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // const submitForm = async (data: DealerFormData) => {
  //   const payload: DealerFormData = {
  //     ...data,
  //     billingPercentage:
  //       data.billingType === "FIXED" ? 0 : Number(data.billingPercentage),
  //     cancellationCharge: data.cancellationBillingEnabled
  //       ? Number(data.cancellationCharge)
  //       : 0,
  //     gstRate: Number(data.gstRate || 0),
  //     reverseChargeLimit: Number(data.reverseChargeLimit || 0),
  //     creditDays: Number(data.creditDays || 0),
  //     creditLimit: Number(data.creditLimit || 0),
  //     rating: Number(data.rating || 0),
  //     openingBalance: Number(data.openingBalance || 0),
  //     // COMBINED CAPACITY
  //     combinedCapacity: {
  //       products: data.combinedCapacity?.products ?? [],
  //       capacity: Number(data.combinedCapacity?.capacity || 0),
  //     },

  //     // INDIVIDUAL CAPACITY
  //     individualCapacities:
  //       data.individualCapacities
  //         ?.filter((item) => item.productId)
  //         .map((item) => ({
  //           productId: item.productId,
  //           productName: item.productName,
  //           capacity: Number(item.capacity),
  //         })) ?? [],
  //   };
  //   console.log(payload);
  //   await onSubmit(payload);
  // };

  // const submitForm = async (data: DealerFormData) => {
  //   const payload: DealerFormData = {
  //     ...data,

  //     billingPercentage:
  //       data.billingType === "FIXED" ? 0 : Number(data.billingPercentage),

  //     cancellationCharge: data.cancellationBillingEnabled
  //       ? Number(data.cancellationCharge)
  //       : 0,

  //     gstRate: Number(data.gstRate || 0),
  //     reverseChargeLimit: Number(data.reverseChargeLimit || 0),
  //     creditDays: Number(data.creditDays || 0),
  //     creditLimit: Number(data.creditLimit || 0),
  //     rating: Number(data.rating || 0),
  //     openingBalance: Number(data.openingBalance || 0),

  //     // ==========================================
  //     // PRODUCT & SERVICES - OPTIONAL
  //     // ==========================================
  //     productServices:
  //       data.productServices
  //         ?.filter((item) => item.productId)
  //         .map((item) => ({
  //           ...item,
  //           categories:
  //             item.categories?.filter((category) => category.categoryId) ?? [],
  //         })) ?? [],

  //     // ==========================================
  //     // COMBINED CAPACITY - OPTIONAL
  //     // ==========================================
  //     combinedCapacity: {
  //       products: data.combinedCapacity?.products ?? [],
  //       capacity: data.combinedCapacity?.products?.length
  //         ? Number(data.combinedCapacity?.capacity || 0)
  //         : 0,
  //     },

  //     // ==========================================
  //     // INDIVIDUAL CAPACITY - OPTIONAL
  //     // ==========================================
  //     individualCapacities:
  //       data.individualCapacities
  //         ?.filter((item) => item.productId)
  //         .map((item) => ({
  //           productId: item.productId,
  //           productName: item.productName,
  //           capacity: Number(item.capacity || 0),
  //         })) ?? [],

  //     securityAmount: Number(data.securityAmount || 0),

  //     additionalInfo:
  //       data.additionalInfo
  //         ?.filter((item) => item.value?.trim())
  //         .map((item) => ({
  //           value: item.value.trim(),
  //         })) ?? [],
  //   };

  //   console.log("DEALER PAYLOAD:", payload);

  //   await onSubmit(payload);
  // };

  const submitForm = async (data: DealerFormData) => {
    try {
      const payload: DealerFormData = {
        ...data,

        billingPercentage:
          data.billingType === "FIXED" ? 0 : Number(data.billingPercentage),

        cancellationCharge: data.cancellationBillingEnabled
          ? Number(data.cancellationCharge)
          : 0,

        gstRate: Number(data.gstRate || 0),
        reverseChargeLimit: Number(data.reverseChargeLimit || 0),
        creditDays: Number(data.creditDays || 0),
        creditLimit: Number(data.creditLimit || 0),
        rating: Number(data.rating || 0),
        openingBalance: Number(data.openingBalance || 0),

        productServices:
          data.productServices
            ?.filter((item) => item.productId)
            .map((item) => ({
              ...item,
              categories:
                item.categories?.filter((category) => category.categoryId) ??
                [],
            })) ?? [],

        combinedCapacity: {
          products: data.combinedCapacity?.products ?? [],
          capacity: data.combinedCapacity?.products?.length
            ? Number(data.combinedCapacity?.capacity || 0)
            : 0,
        },

        individualCapacities:
          data.individualCapacities
            ?.filter((item) => item.productId)
            .map((item) => ({
              productId: item.productId,
              productName: item.productName,
              capacity: Number(item.capacity || 0),
            })) ?? [],

        securityAmount: Number(data.securityAmount || 0),

        additionalInfo:
          data.additionalInfo
            ?.filter((item) => item.value?.trim())
            .map((item) => ({
              value: item.value.trim(),
            })) ?? [],
      };

      console.log("DEALER PAYLOAD:", payload);

      await onSubmit(payload);
    } catch (error: any) {
      console.error("DEALER SUBMIT ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save dealer. Please try again.";

      toast.error(
        typeof message === "string"
          ? message
          : "Failed to save dealer. Please try again.",
      );
    }
  };

  const handleFormError = (errors: FieldErrors<DealerFormData>) => {
    console.error("FORM VALIDATION ERRORS:", errors);

    // Basic tab
    if (
      errors.headName ||
      errors.technicianFirmName ||
      errors.technicianName ||
      errors.mobileNumber ||
      errors.email ||
      errors.dateOfJoining ||
      errors.technicianStatus ||
      errors.businessAddress ||
      errors.residentialAddress
    ) {
      setActiveTab("basic");
      toast.error("Please check the required fields in Basic & Address.");
      return;
    }

    // Documents tab
    if (
      errors.aadhaarNumber ||
      errors.aadhaarFrontFile ||
      errors.aadhaarBackFile ||
      errors.panNumber ||
      errors.panFrontFile ||
      errors.panBackFile ||
      errors.drivingLicenceFrontFile ||
      errors.drivingLicenceBackFile ||
      errors.documentUpload
    ) {
      setActiveTab("documents");
      toast.error("Please check the fields in Identity & Documents.");
      return;
    }

    // Account tab
    if (
      errors.billingType ||
      errors.billingPercentage ||
      errors.cancellationCharge ||
      errors.gstRate ||
      errors.creditLimit ||
      errors.securityAmount ||
      errors.openingBalance
    ) {
      setActiveTab("account");
      toast.error("Please check the fields in Tax & Account.");
      return;
    }

    // Product / capacity
    if (
      errors.productServices ||
      errors.combinedCapacity ||
      errors.individualCapacities
    ) {
      setActiveTab("service");
      toast.error("Please check Product & Capacity fields.");
      return;
    }

    toast.error("Please fix the invalid fields before submitting.");
  };
  return (
    <form
      onSubmit={handleSubmit(submitForm, handleFormError)}
      // onSubmit={handleSubmit(submitForm, (errors) => {
      //   if (
      //     errors.billingType ||
      //     errors.billingPercentage ||
      //     errors.cancellationCharge
      //   )
      //     setActiveTab("account");
      //   console.error(errors);
      //   // console.log("FORM VALIDATION ERRORS:", errors);
      //   toast.error("Please fix the required fields before submitting.");
      // })}
      // className="space-y-7"
      className="space-y-2"
    >
      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>

      <div className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white">
        <div className="grid w-full grid-cols-4">
          {dealerTabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`relative flex min-w-0 items-center justify-center gap-1 border-b-2 px-0.5 py-2 text-[9px] font-medium transition sm:gap-1.5 sm:px-1 sm:text-[10px] md:gap-2 md:px-2 md:py-2.5 md:text-xs lg:px-3 lg:text-sm
                            ${
                              active
                                ? "border-[#123B7A] text-[#123B7A]"
                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }
                          `}
              >
                {/* Number */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold sm:h-4.5 sm:w-4.5 sm:text-[9px] md:h-5 md:w-5 md:text-[10px] ${active ? "bg-[#123B7A] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {tab.number}
                </span>

                {/* Label */}
                <span className="min-w-0 whitespace-nowrap">
                  <span className="sm:hidden">{tab.mobileLabel}</span>

                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {activeTab === "basic" && (
        <div className="space-y-3">
          <Section title="Technician Information">
            <div className="grid grid-cols-1 gap-x-2 gap-y-1.5 md:grid-cols-3 xl:grid-cols-5">
              <Input
                label="Head Code"
                readOnly
                error={errors.headCode?.message}
                {...register("headCode", {
                  // required: "Head code is required",
                })}
              />

              <Input
                label="Head Name"
                readOnly
                error={errors.headName?.message}
                {...register("headName", {
                  required: "Head name is required",
                })}
              />

              <Input
                label="Technician Firm Name"
                required
                // placeholder="Enter technician firm name"
                error={errors.technicianFirmName?.message}
                {...register("technicianFirmName", {
                  required: "Technician firm name is required",
                })}
              />

              <Input
                label="Technician Name"
                required
                // placeholder="Enter technician name"
                error={errors.technicianName?.message}
                {...register("technicianName", {
                  required: "Technician name is required",
                })}
              />

              <Input
                label="Phone Number"
                required
                maxLength={10}
                inputMode="numeric"
                // placeholder="Enter phone number"
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
                // placeholder="Enter alternative number"
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
                // required
                type="email"
                // placeholder="Enter email address"
                error={errors.email?.message}
                {...register("email", {
                  // required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter valid email address",
                  },
                })}
              />

              <Input
                label="Date of Joining"
                required
                type="date"
                error={errors.dateOfJoining?.message}
                {...register("dateOfJoining", {
                  required: "Date of joining is required",
                })}
              />

              <Input
                label="Date of Leaving"
                type="date"
                error={errors.dateOfLeaving?.message}
                {...register("dateOfLeaving", {
                  validate: (value) => {
                    const joiningDate = watch("dateOfJoining");

                    if (!value || !joiningDate) {
                      return true;
                    }

                    return (
                      new Date(value) >= new Date(joiningDate) ||
                      "Leaving date cannot be before joining date"
                    );
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
            <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              {/* Business */}
              <div className="pb-3 lg:pb-0 lg:pr-4">
                <AddressFields
                  type="businessAddress"
                  title="Business Address"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />
              </div>

              {/* Residential */}
              <div className="pt-3 lg:pl-4 lg:pt-0">
                <AddressFields
                  type="residentialAddress"
                  title="Residential Address"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />
              </div>
            </div>
          </Section>

          <Section title="Additionl Info">
            {/* ADDITIONAL INFO */}
            <div className="col-span-full">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* ADDITIONAL FIELDS */}
                {additionalInfoFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <Input
                      label={`Additional Info ${index + 1}`}
                      {...register(`additionalInfo.${index}.value`)}
                    />

                    <button
                      type="button"
                      onClick={() => removeAdditionalInfo(index)}
                      className="absolute right-1 top-0 text-[10px] font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* ADD FIELD BUTTON */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      addAdditionalInfo({
                        value: "",
                      })
                    }
                    className="h-8 w-full rounded-md border border-dashed border-[#123B7A] px-3 text-xs font-medium text-[#123B7A] transition hover:bg-blue-50"
                  >
                    + Add Field
                  </button>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === "documents" && (
        <Section title="Identity & Documents">
          {/* ===================================================== */}
          {/* PRIMARY IDENTITY DOCUMENTS */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {/* =================================================== */}
            {/* AADHAAR */}
            {/* =================================================== */}

            <div className="pb-3 lg:pb-0 lg:pr-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                Aadhaar Card
              </h4>

              <div className="space-y-2">
                {/* Number */}

                <Input
                  label="Aadhaar Number"
                  maxLength={12}
                  inputMode="numeric"
                  // placeholder="Enter 12 digit Aadhaar number"
                  error={errors.aadhaarNumber?.message}
                  {...register("aadhaarNumber", {
                    pattern: {
                      value: /^[0-9]{12}$/,
                      message: "Enter valid 12 digit Aadhaar number",
                    },
                  })}
                />

                {/* Front + Back Inputs */}

                <div className="grid grid-cols-2 gap-2">
                  {/* Front */}

                  <div>
                    <label className={labelClass}>Front</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("aadhaarFrontFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setAadhaarFrontPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.aadhaarFrontFile && (
                      <ErrorText>
                        {errors.aadhaarFrontFile.message as string}
                      </ErrorText>
                    )}
                  </div>

                  {/* Back */}

                  <div>
                    <label className={labelClass}>Back</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("aadhaarBackFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setAadhaarBackPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.aadhaarBackFile && (
                      <ErrorText>
                        {errors.aadhaarBackFile.message as string}
                      </ErrorText>
                    )}
                  </div>
                </div>

                {/* Front + Back Previews */}

                {(aadhaarFrontPreview || aadhaarBackPreview) && (
                  <div className="grid grid-cols-2 gap-2">
                    <CompactDocumentPreview
                      src={aadhaarFrontPreview}
                      label="Aadhaar Front"
                      onRemove={() => {
                        if (aadhaarFrontPreview) {
                          URL.revokeObjectURL(aadhaarFrontPreview);
                        }

                        setAadhaarFrontPreview("");
                        resetField("aadhaarFrontFile");
                      }}
                    />

                    <CompactDocumentPreview
                      src={aadhaarBackPreview}
                      label="Aadhaar Back"
                      onRemove={() => {
                        if (aadhaarBackPreview) {
                          URL.revokeObjectURL(aadhaarBackPreview);
                        }

                        setAadhaarBackPreview("");
                        resetField("aadhaarBackFile");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* =================================================== */}
            {/* PAN CARD */}
            {/* =================================================== */}

            <div className="py-3 lg:px-4 lg:py-0">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                PAN Card
              </h4>

              <div className="space-y-2">
                {/* Number */}

                <Input
                  label="PAN Number"
                  maxLength={10}
                  // placeholder="ABCDE1234F"
                  error={errors.panNumber?.message}
                  {...register("panNumber", {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Enter valid PAN number",
                    },

                    onChange: (event) => {
                      event.target.value = event.target.value.toUpperCase();
                    },
                  })}
                />

                {/* Front + Back Inputs */}

                <div className="grid grid-cols-2 gap-2">
                  {/* Front */}

                  <div>
                    <label className={labelClass}>Front</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("panFrontFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setPanFrontPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.panFrontFile && (
                      <ErrorText>
                        {errors.panFrontFile.message as string}
                      </ErrorText>
                    )}
                  </div>

                  {/* Back */}

                  <div>
                    <label className={labelClass}>Back</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("panBackFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setPanBackPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.panBackFile && (
                      <ErrorText>
                        {errors.panBackFile.message as string}
                      </ErrorText>
                    )}
                  </div>
                </div>

                {/* Previews */}

                {(panFrontPreview || panBackPreview) && (
                  <div className="grid grid-cols-2 gap-2">
                    <CompactDocumentPreview
                      src={panFrontPreview}
                      label="PAN Front"
                      onRemove={() => {
                        if (panFrontPreview) {
                          URL.revokeObjectURL(panFrontPreview);
                        }

                        setPanFrontPreview("");
                        resetField("panFrontFile");
                      }}
                    />

                    <CompactDocumentPreview
                      src={panBackPreview}
                      label="PAN Back"
                      onRemove={() => {
                        if (panBackPreview) {
                          URL.revokeObjectURL(panBackPreview);
                        }

                        setPanBackPreview("");
                        resetField("panBackFile");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* =================================================== */}
            {/* DRIVING LICENCE */}
            {/* =================================================== */}

            <div className="pt-3 lg:pl-4 lg:pt-0">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                Driving Licence
              </h4>

              <div className="space-y-2">
                {/* Number */}

                <Input
                  label="Licence Number"
                  // placeholder="Enter driving licence number"
                  error={errors.drivingLicenceNumber?.message}
                  {...register("drivingLicenceNumber")}
                />

                {/* Front + Back Inputs */}

                <div className="grid grid-cols-2 gap-2">
                  {/* Front */}

                  <div>
                    <label className={labelClass}>Front</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("drivingLicenceFrontFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setDrivingFrontPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.drivingLicenceFrontFile && (
                      <ErrorText>
                        {errors.drivingLicenceFrontFile.message as string}
                      </ErrorText>
                    )}
                  </div>

                  {/* Back */}

                  <div>
                    <label className={labelClass}>Back</label>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      {...register("drivingLicenceBackFile", {
                        validate: validateFileSize,

                        onChange: (event) => {
                          createSingleFilePreview(
                            event.target.files,
                            setDrivingBackPreview,
                          );
                        },
                      })}
                      className={inputClass}
                    />

                    {errors.drivingLicenceBackFile && (
                      <ErrorText>
                        {errors.drivingLicenceBackFile.message as string}
                      </ErrorText>
                    )}
                  </div>
                </div>

                {/* Previews */}

                {(drivingFrontPreview || drivingBackPreview) && (
                  <div className="grid grid-cols-2 gap-2">
                    <CompactDocumentPreview
                      src={drivingFrontPreview}
                      label="Licence Front"
                      onRemove={() => {
                        if (drivingFrontPreview) {
                          URL.revokeObjectURL(drivingFrontPreview);
                        }

                        setDrivingFrontPreview("");
                        resetField("drivingLicenceFrontFile");
                      }}
                    />

                    <CompactDocumentPreview
                      src={drivingBackPreview}
                      label="Licence Back"
                      onRemove={() => {
                        if (drivingBackPreview) {
                          URL.revokeObjectURL(drivingBackPreview);
                        }

                        setDrivingBackPreview("");
                        resetField("drivingLicenceBackFile");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* OTHER DOCUMENTS */}
          {/* ===================================================== */}

          <div className="mt-4 border-t border-gray-200 pt-3">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                Other Documents
              </h4>

              <span className="text-[10px] font-normal text-gray-400">
                Maximum 5 files
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[320px_1fr]">
              {/* Upload */}

              <div>
                <label className={labelClass}>Upload Documents</label>

                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("documentUpload", {
                    validate: {
                      maxFiles: (files) =>
                        !files ||
                        files.length <= 5 ||
                        "You can upload maximum 5 documents",

                      maxSize: (files) =>
                        !files ||
                        Array.from(files).every(
                          (file) => file.size <= 5 * 1024 * 1024,
                        ) ||
                        "Each file must be less than 5 MB",
                    },

                    onChange: (event) => {
                      handleOtherDocuments(event.target.files);
                    },
                  })}
                  className={inputClass}
                />

                {errors.documentUpload && (
                  <ErrorText>
                    {errors.documentUpload.message as string}
                  </ErrorText>
                )}

                <p className="mt-1 text-[10px] text-gray-400">
                  JPG, PNG, WEBP or PDF · Max 5 MB each
                </p>
              </div>

              {/* Other document previews */}

              {otherDocumentPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {otherDocumentPreviews.map((document, index) => (
                    <div
                      key={`${document.name}-${index}`}
                      className="group relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                    >
                      <button
                        type="button"
                        onClick={() => removeOtherDocument(index)}
                        className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                        title="Remove document"
                      >
                        <X size={11} />
                      </button>

                      {document.type.startsWith("image/") ? (
                        <img
                          src={document.url}
                          alt={document.name}
                          className="h-16 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-16 items-center justify-center bg-gray-100">
                          <span className="text-xs font-semibold text-red-600">
                            PDF
                          </span>
                        </div>
                      )}

                      <div className="px-1.5 py-1">
                        <p
                          className="truncate text-[10px] text-gray-600"
                          title={document.name}
                        >
                          {document.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {activeTab === "account" && (
        <div className="space-y-3">
          {/* ================================================= */}
          {/* BILLING TYPE */}
          {/* ================================================= */}

          <Section title="Dealer Billing">
            <p className="mb-3 text-xs text-gray-500"></p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                {
                  value: "FIXED",
                  label: "Service-wise fixed charge",
                },
                {
                  value: "PARTIAL_PAYMENT",
                  label: "Customer amount percentage",
                },
                {
                  value: "PROFIT_SHARING",
                  label: "Profit percentage",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-2 rounded-md border p-3 text-xs ${watch("billingType") === option.value ? "border-[#123B7A] bg-blue-50 text-[#123B7A]" : "border-gray-300 text-gray-600"}`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("billingType", {
                      required: "Choose a billing method",
                    })}
                    className="mt-0.5 accent-[#123B7A]"
                  />
                  <span>
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block leading-5">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.billingType && (
              <ErrorText>{errors.billingType.message}</ErrorText>
            )}
            {watch("billingType") === "FIXED" ? (
              <div className="mt-3 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                <p>
                  Service rates are configured under Product &amp; Capacity. For
                  example, an agreed AC service rate of ₹300 means a ₹300 charge
                  when closed as AC service.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("service")}
                  className="mt-2 font-medium text-[#123B7A] underline"
                >
                  Configure service rates
                </button>
              </div>
            ) : (
              <div className="mt-3 max-w-sm">
                <Input
                  label={
                    watch("billingType") === "PROFIT_SHARING"
                      ? "Percentage of profit (%)"
                      : "Percentage of customer amount (%)"
                  }
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  {...register("billingPercentage", {
                    valueAsNumber: true,
                    validate: (value, values) =>
                      values.billingType === "FIXED" ||
                      (Number.isFinite(value) &&
                        Number(value) > 0 &&
                        Number(value) <= 100) ||
                      "Enter a percentage greater than 0 and up to 100",
                  })}
                  error={errors.billingPercentage?.message}
                />
              </div>
            )}
            <div className="mt-4 border-t border-gray-200 pt-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
                <input
                  type="checkbox"
                  {...register("cancellationBillingEnabled")}
                  className="accent-[#123B7A]"
                />
                Also charge for cancelled complaints
              </label>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Cancellation at any stage is billable only after DG team
                approval. Each complaint can have either a closure charge or a
                cancellation charge, never both.
              </p>
              {watch("cancellationBillingEnabled") && (
                <div className="mt-3 max-w-sm">
                  <Input
                    label="Cancellation charge (₹)"
                    type="number"
                    min="0.01"
                    step="0.01"
                    {...register("cancellationCharge", {
                      valueAsNumber: true,
                      validate: (value, values) =>
                        !values.cancellationBillingEnabled ||
                        (Number.isFinite(value) && Number(value) > 0) ||
                        "Enter a cancellation charge greater than 0",
                    })}
                    error={errors.cancellationCharge?.message}
                  />
                </div>
              )}
            </div>
          </Section>

          {/* ================================================= */}
          {/* TAX INFORMATION */}
          {/* ================================================= */}

          <Section title="Tax Information">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* GST Number */}

              <Input label="GST No." {...register("gstNumber")} />

              {/* TIN Number */}

              <Input label="TIN No." {...register("tinNumber")} />

              {/* GST Applicable */}

              <div>
                <label className={labelClass}>GST Applicable</label>

                <select {...register("gstApplicable")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>

              {/* GST Rate */}

              <Input
                label="GST Rate"
                type="number"
                min={0}
                step="0.01"
                {...register("gstRate", {
                  valueAsNumber: true,
                })}
              />

              {/* HSN Code */}

              <Input label="HSN Code" {...register("hsnCode")} />

              {/* Reverse Charge Limit */}

              <Input
                label="Limit of Reverse Charges"
                type="number"
                min={0}
                {...register("reverseChargeLimit", {
                  valueAsNumber: true,
                })}
              />

              {/* Tax Input / Payable */}

              <div>
                <label className={labelClass}>Tax Input / Payable</label>

                <select {...register("taxInputPayable")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="INPUT">Input</option>
                  <option value="PAYABLE">Payable</option>
                </select>
              </div>
            </div>
          </Section>

          {/* ================================================= */}
          {/* CREDIT + OPENING BALANCE + OTHER INFO */}
          {/* ================================================= */}

          <Section title="Credit & Opening Balance Information">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Credit Limit */}

              <Input
                label="Credit Limit"
                type="number"
                min={0}
                {...register("creditLimit", {
                  valueAsNumber: true,
                })}
              />

              {/* Security Amount */}
              <Input
                label="Security Amount"
                type="number"
                min={0}
                step="0.01"
                {...register("securityAmount", {
                  valueAsNumber: true,
                })}
              />

              {/* Opening Balance */}

              <Input
                label="Opening Balance"
                type="number"
                step="0.01"
                {...register("openingBalance", {
                  valueAsNumber: true,
                })}
              />

              {/* Balance Type */}

              <div>
                <label className={labelClass}>Balance Type</label>

                <select
                  {...register("openingBalanceType")}
                  className={inputClass}
                >
                  <option value="DR">Debit (Dr)</option>
                  <option value="CR">Credit (Cr)</option>
                </select>
              </div>

              {/* Other Info */}

              <div>
                <label className={labelClass}>Other Info.</label>

                <input
                  type="text"
                  placeholder="Enter other information"
                  {...register("otherInfo")}
                  className={inputClass}
                />
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === "service" && (
        <div className="grid grid-cols-1 divide-y divide-gray-200 xl:grid-cols-2 xl:divide-x xl:divide-y-0">
          <div className="pb-3 xl:pb-0 xl:pr-4">
            <Section title="Product & Service Information">
              <ProductServiceFields
                fields={productFields}
                append={appendProduct}
                remove={removeProduct}
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />
            </Section>
          </div>
          <div className="pt-3 xl:pl-4 xl:pt-0">
            <Section title="Capacity Master">
              <div className="space-y-8">
                {/* ====================================================== */}
                {/* COMBINED CAPACITY */}
                {/* ====================================================== */}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Combined Capacity
                    </h4>
                  </div>

                  {/* SELECT PRODUCT + CAPACITY */}

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* SELECT PRODUCTS */}

                    <div>
                      <SearchSelect
                        label="Select Products"
                        value=""
                        placeholder="Search product..."
                        loading={capacityProductsLoading}
                        options={capacityProducts.map((product) => ({
                          value: product.product_id,
                          label: product.product_name,
                          data: product,
                        }))}
                        onSearch={loadCapacityProducts}
                        onSelect={(option) => {
                          const product = option.data as ProductDropdownOption;

                          const alreadySelected = combinedCapacityProducts.some(
                            (item) => item.productId === product.product_id,
                          );

                          if (alreadySelected) {
                            toast.error(
                              "Product already selected in combined capacity.",
                            );

                            return;
                          }

                          setValue(
                            "combinedCapacity.products",
                            [
                              ...combinedCapacityProducts,
                              {
                                productId: product.product_id,
                                productName: product.product_name,
                              },
                            ],
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );
                        }}
                      />
                    </div>

                    {/* COMBINED CAPACITY */}

                    <div>
                      <label className={labelClass}>Combined Capacity</label>

                      <input
                        type="number"
                        min={0}
                        placeholder="Enter combined capacity"
                        {...register("combinedCapacity.capacity", {
                          valueAsNumber: true,

                          min: {
                            value: 0,
                            message: "Capacity cannot be negative",
                          },

                          validate: (value) => {
                            if (
                              combinedCapacityProducts.length > 0 &&
                              (!value || value < 1)
                            ) {
                              return "Combined capacity is required";
                            }

                            return true;
                          },
                        })}
                        className={inputClass}
                      />

                      {errors.combinedCapacity?.capacity && (
                        <ErrorText>
                          {errors.combinedCapacity.capacity.message}
                        </ErrorText>
                      )}
                    </div>
                  </div>

                  {/* SELECTED PRODUCTS */}

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Selected Products
                    </p>

                    {combinedCapacityProducts.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {combinedCapacityProducts.map((product, index) => (
                          <div
                            key={product.productId}
                            className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                          >
                            <span>{product.productName}</span>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = combinedCapacityProducts.filter(
                                  (_, i) => i !== index,
                                );

                                setValue("combinedCapacity.products", updated, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-full text-blue-500 transition hover:bg-red-50 hover:text-red-600"
                              title="Remove product"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        No products selected
                      </p>
                    )}
                  </div>
                </div>

                {/* ====================================================== */}
                {/* INDIVIDUAL CAPACITY */}
                {/* ====================================================== */}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Individual Capacity
                    </h4>
                  </div>

                  {/* HEADER */}

                  <div className="mb-2 hidden grid-cols-[2fr_1fr_auto] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                    <div>Product</div>

                    <div>Capacity</div>

                    <div>Action</div>
                  </div>

                  {/* ROWS */}

                  <div className="space-y-2">
                    {individualCapacityFields.map((field, index) => {
                      const item = individualCapacities[index];

                      return (
                        <div
                          key={field.id}
                          className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[2fr_1fr_auto]"
                        >
                          {/* PRODUCT */}

                          <div>
                            <SearchSelect
                              label="Product"
                              value={item?.productName ?? ""}
                              placeholder="Search product..."
                              loading={capacityProductsLoading}
                              // options={capacityProducts.map((product) => ({
                              options={availableIndividualProducts.map((product) => ({
                                value: product.product_id,
                                label: product.product_name,
                                data: product,
                              }))}
                              onSearch={loadCapacityProducts}
                              onSelect={(option) => {
                                const product =
                                  option.data as ProductDropdownOption;

                                const duplicate = individualCapacities.some(
                                  (selected, currentIndex) =>
                                    currentIndex !== index &&
                                    selected.productId === product.product_id,
                                );

                                if (duplicate) {
                                  toast.error(
                                    "This product already has individual capacity.",
                                  );

                                  return;
                                }

                                setValue(
                                  `individualCapacities.${index}.productId`,
                                  product.product_id,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );

                                setValue(
                                  `individualCapacities.${index}.productName`,
                                  product.product_name,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              }}
                              onClear={() => {
                                setValue(
                                  `individualCapacities.${index}.productId`,
                                  undefined,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );

                                setValue(
                                  `individualCapacities.${index}.productName`,
                                  "",
                                  {
                                    shouldDirty: true,
                                  },
                                );
                              }}
                            />

                            {/* REGISTER CUSTOM SELECT */}

                            <input
                              type="hidden"
                              {...register(
                                `individualCapacities.${index}.productId`,
                                // {
                                //   required:
                                //     "Product is required",
                                // },
                              )}
                            />
                          </div>

                          {/* CAPACITY */}

                          <div>
                            <label className={labelClass}>Capacity</label>

                            <input
                              type="number"
                              min={0}
                              placeholder="Enter capacity"
                              {...register(
                                `individualCapacities.${index}.capacity`,
                                {
                                  // required: "Capacity is required",

                                  valueAsNumber: true,

                                  min: {
                                    value: 0,
                                    message: "Capacity must be greater than 0",
                                  },
                                },
                              )}
                              className={inputClass}
                            />

                            {errors.individualCapacities?.[index]?.capacity && (
                              <ErrorText>
                                {
                                  errors.individualCapacities[index]?.capacity
                                    ?.message
                                }
                              </ErrorText>
                            )}
                          </div>

                          {/* REMOVE */}

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeIndividualCapacity(index)}
                              className="flex h-10.5 w-10.5 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                              title="Remove product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD INDIVIDUAL PRODUCT */}

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        appendIndividualCapacity({
                          productId: undefined,
                          productName: "",
                          capacity: 0,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-medium text-[#123B7A] transition hover:bg-blue-50"
                    >
                      <Plus size={17} />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      )}
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
    <section className="rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-gray-50 px-3 py-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
          {title}
        </h3>
      </div>

      <div className="p-2.5">{children}</div>
    </section>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, required, ...props }: InputProps) {
  return (
    <div>
      <label className={labelClass}>{label}
         {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
     
      <input
        {...props}
        required={required}
        aria-required={required}
        className={inputClass}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

const labelClass = "mb-0.5 block text-[11px] font-medium text-gray-600";

const inputClass =
  "h-8 w-full rounded-md border border-gray-300 bg-white px-2 " +
  "text-xs outline-none transition " +
  "focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const validateFileSize = (files?: FileList) => {
  if (!files?.length) {
    return true;
  }

  return files[0].size <= MAX_FILE_SIZE || "File size must be less than 5 MB";
};

function CompactDocumentPreview({
  src,
  label,
  onRemove,
}: {
  src?: string;
  label: string;
  onRemove: () => void;
}) {
  if (!src) {
    return (
      <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50">
        <span className="text-[10px] text-gray-400">No preview</span>
      </div>
    );
  }

  const isPdf =
    src.toLowerCase().includes(".pdf") ||
    src.startsWith("data:application/pdf");

  return (
    <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
        title={`Remove ${label}`}
      >
        <X size={11} />
      </button>

      {isPdf ? (
        <div className="flex h-20 items-center justify-center">
          <span className="text-xs font-semibold text-red-600">PDF</span>
        </div>
      ) : (
        <img src={src} alt={label} className="h-20 w-full object-cover" />
      )}

      <div className="border-t border-gray-200 bg-white px-1.5 py-1">
        <p className="truncate text-[10px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}
