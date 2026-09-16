import {
  AlertCircle,
  CheckCircle2,
  History,
  Loader2,
  Search,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createComplaint,
  lookupCustomerByPhone,
  updateCustomer,
  searchBrands,
  searchProducts,
  searchProductTypes,
  searchCategories,
  type BrandDropdownOption,
  type ProductDropdownOption,
  type ProductTypeDropdownOption,
  type CategoryDropdownOption,
} from "../services/complaintApi";

import type {
  Complaint,
  ComplaintCategory,
  ComplaintHistoryItem,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintType,
  Customer,
  ComplaintAddress,
  ComplaintFormData,
} from "../types/complaint.types";
import { toast } from "react-toastify";
import ComplaintAddressFields from "./ComplaintAddressFields";
import { useDebounce } from "../../../hooks/useDebounce";
import SearchSelect from "../../../components/ui/SearchSelect";
import { useNavigate } from "react-router-dom";

interface ComplaintHistoryTableProps {
  history: ComplaintHistoryItem[];
  loading: boolean;
  lookupDone: boolean;
  selectedType?: ComplaintType;
}

interface ComplaintFormProps {
  onComplaintCreated?: (complaint: Complaint) => void;
}

const formatComplaintDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

const generateComplaintNumber = () => {
  const now = new Date();
  const datePart = formatComplaintDate(now);
  const sequence = "0001";
  return `CMP${datePart}/${sequence}`;
};

export default function ComplaintForm({
  onComplaintCreated,
}: ComplaintFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    defaultValues: {
      complaintNumber: generateComplaintNumber(),
      // complaintDateTime: new Date().toISOString(),
      customerId: "",
      customerPhone: "",
      customerName: "",
      alternatePhone: "",
      customerEmail: "",
      address: {
        addressLine: "",
        stateId: undefined,
        state: "",
        districtId: undefined,
        district: "",
        cityId: undefined,
        city: "",
        pincodeId: undefined,
        pinCode: "",
      },

      contactInfo: "",

      brandId: "",
      brand: "",

      productId: undefined,
      productName: "",

      productTypeId: "",
      productType: "",

      productDescription: "",

      units: 1,
      quoteAmount: undefined,

      faultReported: "",

      category: "",
      priority: "MEDIUM",

      complaintType: "REGULAR",

      adName: "",
      status: "REGISTERED",
      repeatComplaintNumber: "",

      subject: "",
      description: "",
    },
  });

  // const handleWarrantyHistorySelect = (complaint: ComplaintHistoryItem) => {
  //   if (complaint.complaintType !== "WARRANTY") {
  //     return;
  //   }

  //   const oldComplaintNumber = complaint.complaintNumber;
  //   console.log("Selected warranty complaint:", complaint);

  //   // Set type to warranty
  //   setValue("complaintType", "WARRANTY", {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });

  //   // Old complaint
  //   setValue("repeatComplaintNumber", oldComplaintNumber, {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });

  //   // New complaint
  //   setValue("complaintNumber", `${oldComplaintNumber}/01`, {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });
  // };

  const handleUpdateCustomer = async () => {
    if (!existingCustomer) {
      toast.error("Customer not found");
      return;
    }

    const data = getValues();

    if (!data.customerName?.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(data.customerPhone?.trim())) {
      toast.error("Enter valid registered mobile number");
      return;
    }

    if (
      data.alternatePhone &&
      !/^[0-9]{10}$/.test(data.alternatePhone.trim())
    ) {
      toast.error("Enter valid alternative mobile number");
      return;
    }

    if (!data.address?.addressLine?.trim()) {
      toast.error("Customer address is required");
      return;
    }

    try {
      setUpdatingCustomer(true);

      const updatedCustomer = await updateCustomer(existingCustomer.id, {
        name: data.customerName.trim(),

        phone: data.customerPhone.trim(),

        alternatePhone: data.alternatePhone?.trim() || "",

        email: data.customerEmail?.trim() || "",

        address: {
          addressLine: data.address.addressLine?.trim() || "",

          stateId: data.address.stateId ? Number(data.address.stateId) : null,

          state: data.address.state?.trim() || "",

          districtId: data.address.districtId
            ? Number(data.address.districtId)
            : null,

          district: data.address.district?.trim() || "",

          cityId: data.address.cityId ? Number(data.address.cityId) : null,

          city: data.address.city?.trim() || "",

          pincodeId: data.address.pincodeId
            ? Number(data.address.pincodeId)
            : null,

          pinCode: data.address.pinCode?.trim() || "",
        },

        contactInfo: data.contactInfo?.trim() || "",

        status: existingCustomer.status || "ACTIVE",
      });

      setExistingCustomer(updatedCustomer);

      fillCustomerDetails(updatedCustomer);

      toast.success("Customer updated successfully");
    } catch (error: any) {
      console.error("Update customer error:", error);

      toast.error(error.response?.data?.message || "Failed to update customer");
    } finally {
      setUpdatingCustomer(false);
    }
  };

  const customerPhone = watch("customerPhone");

  useEffect(() => {
    const phone = customerPhone?.replace(/\D/g, "") || "";

    if (phone.length < 10) {
      if (existingCustomer) {
        clearCustomerForm();
      }

      setExistingCustomer(null);
      setLookupError("");
      setLookupDone(false);

      return;
    }

    if (phone.length === 10) {
      lookupCustomer(phone);
    }
  }, [customerPhone]);

  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(
    null,
  );
  const [complaintHistory, setComplaintHistory] = useState<
    ComplaintHistoryItem[]
  >([]);

  const selectedComplaintType = watch("complaintType");
  const selectedOldComplaintNumber = watch("repeatComplaintNumber");
  // const filteredComplaintHistory =
  //   selectedComplaintType === "WARRANTY"
  //     ? complaintHistory.filter(
  //         (complaint) => complaint.complaintType === "WARRANTY",
  //       )
  //     : complaintHistory;

  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [updatingCustomer, setUpdatingCustomer] = useState(false);
  const [brands, setBrands] = useState<BrandDropdownOption[]>([]);
  const [products, setProducts] = useState<ProductDropdownOption[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeDropdownOption[]>(
    [],
  );
  const [brandSearch, setBrandSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productTypeSearch, setProductTypeSearch] = useState("");
  const [brandLoading, setBrandLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productTypeLoading, setProductTypeLoading] = useState(false);
  const debouncedBrandSearch = useDebounce(brandSearch, 500);
  const debouncedProductSearch = useDebounce(productSearch, 500);
  const debouncedProductTypeSearch = useDebounce(productTypeSearch, 500);

  const selectedBrand = watch("brand");
  const selectedProductId = watch("productId");
  const selectedProductName = watch("productName");
  const selectedProductType = watch("productType");
  const selectedComplaintNumber = watch("repeatComplaintNumber");

  const [categories, setCategories] = useState<CategoryDropdownOption[]>([]);

  const [categorySearch, setCategorySearch] = useState("");

  const [categoryLoading, setCategoryLoading] = useState(false);

  const debouncedCategorySearch = useDebounce(categorySearch, 500);

  const selectedCategory = watch("category");

  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const now = new Date();
  //     setCurrentDateTime(now);
  //     setValue("complaintDateTime", now.toISOString());
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [setValue]);

  // Registered Mobile Lookup
  useEffect(() => {
    const phone = customerPhone?.trim();
    if (!phone || phone.length !== 10) {
      setExistingCustomer(null);
      setComplaintHistory([]);
      setLookupDone(false);
      return;
    }

    const timer = setTimeout(() => {
      lookupCustomer(phone);
    }, 500);

    return () => clearTimeout(timer);
  }, [customerPhone]);

  const formatComplaintDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  };
  // const handleWarrantySelect = (complaint: ComplaintHistoryItem) => {
  //   if (!complaint.isWarranty) {
  //     toast.error("This complaint is not under warranty");
  //     return;
  //   }

  //   setValue("repeatComplaintNumber", complaint.complaintNumber, {
  //     shouldDirty: true,
  //     shouldValidate: true,
  //   });

  //   toast.success(
  //     `Complaint ${complaint.complaintNumber} selected for warranty`,
  //   );
  // };

  const loadCategories = async (search: string) => {
    if (!selectedProductId) {
      setCategories([]);
      return;
    }

    try {
      setCategoryLoading(true);

      const data = await searchCategories({
        productId: Number(selectedProductId),
        search,
      });

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedProductId) {
      setCategories([]);
      return;
    }

    loadCategories(debouncedCategorySearch);
  }, [debouncedCategorySearch, selectedProductId]);

  const handleCategorySelect = (category: CategoryDropdownOption) => {
    setValue("categoryId", category._id || category.id || "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("category", category.category, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleWarrantySelect = (complaint: ComplaintHistoryItem) => {
    // if (selectedComplaintType !== "WARRANTY") {
    //   return;
    // }

    if (!complaint.isWarranty) {
      toast.error("This complaint is not under warranty");
      return;
    }

    // Automatically make this a warranty complaint
    setValue("complaintType", "WARRANTY", {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("repeatComplaintNumber", complaint.complaintNumber, {
      shouldDirty: true,
      shouldValidate: true,
    });

    toast.success(
      `${complaint.complaintNumber} selected for warranty complaint`,
    );
  };
  const loadBrands = async (search: string) => {
    try {
      setBrandLoading(true);

      const data = await searchBrands(search);

      setBrands(data);
    } catch (error) {
      console.error("Failed to load brands:", error);

      setBrands([]);
    } finally {
      setBrandLoading(false);
    }
  };

  useEffect(() => {
    loadBrands(debouncedBrandSearch);
  }, [debouncedBrandSearch]);

  const loadProducts = async (search: string) => {
    try {
      setProductLoading(true);

      const data = await searchProducts(search);

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);

      setProducts([]);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(debouncedProductSearch);
  }, [debouncedProductSearch]);

  const loadProductTypes = async (search: string) => {
    if (!selectedProductId) {
      setProductTypes([]);
      return;
    }

    try {
      setProductTypeLoading(true);

      const data = await searchProductTypes({
        productId: Number(selectedProductId),

        search,
      });

      setProductTypes(data);
    } catch (error) {
      console.error("Failed to load product types:", error);

      setProductTypes([]);
    } finally {
      setProductTypeLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedProductId) {
      setProductTypes([]);
      return;
    }

    loadProductTypes(debouncedProductTypeSearch);
  }, [debouncedProductTypeSearch, selectedProductId]);
  const handleBrandSelect = (brand: BrandDropdownOption) => {
    setValue("brandId", brand.id);

    setValue("brand", brand.brandName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const handleProductSelect = (product: ProductDropdownOption) => {
    setValue("productId", product.product_id, {
      shouldValidate: true,
    });

    setValue("productName", product.product_name, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // reset product type
    setValue("productTypeId", "");

    setValue("productType", "");

    setProductTypeSearch("");
    setProductTypes([]);

    // reset category
    setValue("category", "");

    setCategorySearch("");
    setCategories([]);
  };

  const handleProductTypeSelect = (productType: ProductTypeDropdownOption) => {
    setValue("productTypeId", productType.id || "");

    setValue("productType", productType.product_type, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  // Alternate Mobile Lookup

  // useEffect(() => {
  //   // const phone = alternatePhone?.trim();

  //   if (!phone || phone.length !== 10) {
  //     return;
  //   }

  //   if (phone === customerPhone) {
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     lookupCustomer(phone);
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [
  //   // alternatePhone,
  //    customerPhone]);

  // Customer Lookup
  const lookupCustomer = async (phone: string) => {
    try {
      setLookupLoading(true);
      setLookupDone(false);
      setLookupError(null);
      const response = await lookupCustomerByPhone(phone);
      setExistingCustomer(response.customer);
      setComplaintHistory(response.complaintHistory || []);

      if (response.customer) {
        fillCustomerDetails(response.customer);
      }

      setLookupDone(true);
    } catch (error: any) {
      setExistingCustomer(null);
      setComplaintHistory([]);
      setLookupDone(true);
      setLookupError(
        error?.response?.data?.message || "Unable to search customer",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  //  Auto Fill Existing Customer
  // const fillCustomerDetails = (customer: Customer) => {
  //   setValue("customerId", customer.id);
  //   setValue("customerName", customer.name || "");
  //   setValue("customerPhone", customer.phone || "");
  //   setValue("alternatePhone", customer.alternatePhone || "");
  //   setValue("customerEmail", customer.email || "");
  //   setValue("address", customer.address?.addressLine || "");
  //   setValue("stateId", customer.address?.stateId ?? undefined);
  //   setValue("state", customer.address?.state || "");
  //   setValue("districtId", customer.address?.districtId ?? undefined);
  //   setValue("district", customer.address?.district || "");
  //   setValue("cityId", customer.address?.cityId ?? undefined);
  //   setValue("city", customer.address?.city || "");
  //   setValue("pincodeId", customer.address?.pincodeId ?? undefined);
  //   setValue("pincode", customer.address?.pinCode || "");
  //   setValue("contactInfo", customer.contactInfo || "");
  // };

  const clearCustomerForm = () => {
    // Customer
    setValue("customerName", "");
    setValue("alternatePhone", "");
    setValue("email", "");

    // Address
    setValue("address.addressLine", "");

    setValue("address.stateId", undefined);
    setValue("address.state", "");

    setValue("address.districtId", undefined);
    setValue("address.district", "");

    setValue("address.cityId", undefined);
    setValue("address.city", "");

    setValue("address.pincodeId", undefined);
    setValue("address.pinCode", "");

    // Existing customer state
    setExistingCustomer(null);
    setLookupError("");
    setLookupDone(false);
  };

  const fillCustomerDetails = (customer: Customer) => {
    setValue("customerId", customer.id);

    setValue("customerName", customer.name || "");

    setValue("customerPhone", customer.phone || "");

    setValue("alternatePhone", customer.alternatePhone || "");

    setValue("customerEmail", customer.email || "");

    setValue("address", {
      addressLine: customer.address?.addressLine || "",

      stateId: customer.address?.stateId ?? undefined,

      state: customer.address?.state || "",

      districtId: customer.address?.districtId ?? undefined,

      district: customer.address?.district || "",

      cityId: customer.address?.cityId ?? undefined,

      city: customer.address?.city || "",

      pincodeId: customer.address?.pincodeId ?? undefined,

      pinCode: customer.address?.pinCode || "",
    });

    setValue("contactInfo", customer.contactInfo || "");
  };

  // Submit
  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setSubmitting(true);
      console.log("Complaint:", data);
      const createdComplaint = await createComplaint({
        customerId: data.customerId,
        customerCode: data.customerCode,
        customerName: data.customerName,
        phone: data.customerPhone,
        alternatePhone: data.alternatePhone,
        email: data.customerEmail,
        address: {
          addressLine: data.address.addressLine,
          stateId: data.address.stateId ? Number(data.address.stateId) : null,
          state: data.address.state,
          districtId: data.address.districtId
            ? Number(data.address.districtId)
            : null,
          district: data.address.district,
          cityId: data.address.cityId ? Number(data.address.cityId) : null,
          city: data.address.city,
          pincodeId: data.address.pincodeId
            ? Number(data.address.pincodeId)
            : null,
          pinCode: data.address.pinCode,
        },
        city: data.city,
        district: data.district,
        state: data.state,
        pincode: data.pincode,
        contactInfo: data.contactInfo,
        productName: data.productName,
        units: Number(data.units),
        quoteAmount: data.quoteAmount ? Number(data.quoteAmount) : undefined,
        productDescription: data.productDescription,
        productId: data.productId,
        productName: data.productName,

        productTypeId: data.productTypeId,
        productType: data.productType,

        categoryId: data.categoryId,
        // category: data.category,
        faultReported: data.faultReported,
        category: data.category,
        priority: data.priority,
        complaintType: data.complaintType,
        adName: data.adName,
        repeatComplaintNumber: data.repeatComplaintNumber,
        subject: data.subject,
        description: data.description,
      });
      // onComplaintCreated?.(createdComplaint);
      navigate("/complaints");
      toast.success("Complaint created successfully");
    } catch (error) {
      console.error("Create complaint error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomerLookup = async (phone: string) => {
    try {
      const response = await lookupCustomerByPhone(phone);
      setExistingCustomer(response.customer);
      setComplaintHistory(response.complaintHistory || []);
      if (response.customer) {
        fillCustomerDetails(response.customer);
      }
    } catch (error) {
      console.error("Customer lookup failed:", error);
    }
  };

  console.log(complaintHistory);

  //   useEffect(() => {
  //   if (selectedComplaintType === "WARRANTY") {
  //     setValue("repeatComplaintNumber", "");
  //     setValue("complaintNumber", "");
  //   } else {
  //     setValue("repeatComplaintNumber", "");
  //     setValue(
  //       "complaintNumber",
  //       generateComplaintNumber(),
  //     );
  //   }
  // }, [selectedComplaintType, setValue]);

  //   return (
  //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
  //       {/* COMPLAINT INFORMATION */}

  //       {/*  CUSTOMER INFORMATION */}

  //       <Section title="Customer Information">
  //         {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
  //         <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2 lg:grid-cols-4">
  //           {/* Registered Mobile Number */}
  //           <div>
  //             <label className="mb-1 block text-sm font-medium text-gray-700">
  //               Registered Mobile Number
  //               <span className="ml-1 text-red-500">*</span>
  //             </label>

  //             <div className="relative">
  //               <input
  //                 {...register("customerPhone", {
  //                   required: "Registered mobile number is required",
  //                   pattern: {
  //                     value: /^[0-9]{10}$/,
  //                     message: "Enter valid 10 digit mobile number",
  //                   },
  //                 })}
  //                 maxLength={10}
  //                 inputMode="numeric"
  //                 placeholder="9876543210"
  //                 className={inputClass}
  //               />

  //               {lookupLoading && (
  //                 <Loader2
  //                   size={17}
  //                   className="absolute right-3 top-3 animate-spin text-gray-400"
  //                 />
  //               )}
  //             </div>

  //             {errors.customerPhone && (
  //               <ErrorText>{errors.customerPhone.message}</ErrorText>
  //             )}
  //           </div>

  //           <Input
  //             label="Alternative Phone No."
  //             placeholder="9876543210"
  //             maxLength={10}
  //             inputMode="numeric"
  //             error={errors.alternatePhone?.message}
  //             {...register("alternatePhone", {
  //               pattern: {
  //                 value: /^$|^[0-9]{10}$/,
  //                 message: "Enter valid 10 digit mobile number",
  //               },
  //             })}
  //           />

  //           <Input
  //             label="Customer Name"
  //             placeholder="Customer name"
  //             error={errors.customerName?.message}
  //             {...register("customerName", {
  //               required: "Customer name is required",
  //             })}
  //           />

  //           {/* City */}

  //           {/* <div className="md:col-span-2">
  //             <label className="mb-1 block text-sm font-medium text-gray-700">
  //               Customer Address
  //               <span className="ml-1 text-red-500">*</span>
  //             </label>

  //             <input
  //               {...register("address", {
  //                 required: "Customer address is required",
  //               })}
  //               placeholder="Enter customer address"
  //               className={inputClass}
  //             />

  //             {errors.address && <ErrorText>{errors.address.message}</ErrorText>}
  //           </div>

  //           <Input
  //             label="City"
  //             placeholder="City"
  //             error={errors.city?.message}
  //             {...register("city", {
  //               required: "City is required",
  //             })}
  //           /> */}

  //           {/* District */}

  //           {/* <Input
  //             label="District"
  //             placeholder="District"
  //             {...register("district")}
  //           /> */}

  //           {/* State */}

  //           {/* <Input
  //             label="State"
  //             placeholder="State"
  //             error={errors.state?.message}
  //             {...register("state", {
  //               required: "State is required",
  //             })}
  //           /> */}

  //           {/* Pin Code */}

  //           {/* <Input
  //             label="Pin Code"
  //             placeholder="452001"
  //             maxLength={6}
  //             inputMode="numeric"
  //             error={errors.pincode?.message}
  //             {...register("pincode", {
  //               pattern: {
  //                 value: /^[0-9]{6}$/,
  //                 message: "Enter valid 6 digit pin code",
  //               },
  //             })}
  //           /> */}
  //         </div>

  //         <div className="mt-5">
  //           <ComplaintAddressFields
  //             register={register}
  //             setValue={setValue}
  //             watch={watch}
  //             errors={errors}
  //           />
  //         </div>

  //         {existingCustomer && (
  //           <button
  //             type="button"
  //             onClick={handleUpdateCustomer}
  //             disabled={updatingCustomer}
  //             className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-60"
  //           >
  //             {updatingCustomer ? "Updating..." : "Update Customer"}
  //           </button>
  //         )}

  //         {/* Existing Customer Status */}

  //         {lookupError && (
  //           <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
  //             <AlertCircle size={18} />

  //             {lookupError}
  //           </div>
  //         )}

  // {lookupDone && !lookupError && existingCustomer && (
  //   <div className="mt-2 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-1.5">
  //     <div className="flex items-center gap-2 text-xs text-green-700">
  //       <UserCheck size={15} />
  //       <span>
  //         Existing customer:{" "}
  //         <strong>{existingCustomer.name}</strong>
  //       </span>
  //     </div>

  //     <button
  //       type="button"
  //       onClick={handleUpdateCustomer}
  //       disabled={updatingCustomer}
  //       className="text-xs font-medium text-[#123B7A] hover:underline"
  //     >
  //       {updatingCustomer ? "Updating..." : "Update Customer"}
  //     </button>
  //   </div>
  // )}
  //       </Section>

  //       {/* PRODUCT INFORMATION */}

  //       <Section title="Product & Complaint Details">
  //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           {/* <Input
  //             label="Brand"
  //             placeholder="Brand"
  //             {...register("contactInfo")}
  //           /> */}

  //           {/* BRAND */}

  //           <SearchSelect
  //             label="Brand"
  //             value={selectedBrand || ""}
  //             placeholder="Search brand..."
  //             loading={brandLoading}
  //             options={brands.map((brand) => ({
  //               value: brand.id,

  //               label: brand.brandName,

  //               data: brand,
  //             }))}
  //             onSearch={setBrandSearch}
  //             onSelect={(option) =>
  //               handleBrandSelect(option.data as BrandDropdownOption)
  //             }
  //             onClear={() => {
  //               setValue("brandId", "");

  //               setValue("brand", "");

  //               setBrandSearch("");
  //             }}
  //           />
  //           {/* <Input
  //             label="Product"
  //             placeholder="Product"
  //             error={errors.productName?.message}
  //             {...register("productName", {
  //               required: "Product is required",
  //             })}
  //           /> */}

  //           {/* PRODUCT */}

  //           <SearchSelect
  //             label="Product"
  //             value={selectedProductName || ""}
  //             placeholder="Search product..."
  //             loading={productLoading}
  //             options={products.map((product) => ({
  //               value: product.product_id,

  //               label: product.product_name,

  //               data: product,
  //             }))}
  //             onSearch={setProductSearch}
  //             onSelect={(option) =>
  //               handleProductSelect(option.data as ProductDropdownOption)
  //             }
  //             onClear={() => {
  //               setValue("productId", undefined);

  //               setValue("productName", "");

  //               setValue("productTypeId", "");

  //               setValue("productType", "");

  //               setProductSearch("");
  //               setProductTypeSearch("");
  //               setProductTypes([]);
  //             }}
  //             error={errors.productName?.message}
  //           />

  //           {/* CATEGORY */}

  // <SearchSelect
  //   label="Category"
  //   value={selectedCategory || ""}
  //   placeholder={
  //     selectedProductId
  //       ? "Search category..."
  //       : "Select product first"
  //   }
  //   loading={categoryLoading}
  //   options={categories.map((category) => ({
  //     value: category.id ?? `${category.product_id}-${category.category}`,
  //     label: category.category,
  //     data: category,
  //   }))}
  //   onSearch={setCategorySearch}
  //   onSelect={(option) =>
  //     handleCategorySelect(option.data as CategoryDropdownOption)
  //   }
  //   onClear={() => {
  //     setValue("category", "");
  //     setCategorySearch("");
  //   }}
  //   error={errors.category?.message}
  // />

  //           {/* PRODUCT TYPE */}

  //           <SearchSelect
  //             label="Product Type"
  //             value={selectedProductType || ""}
  //             placeholder={
  //               selectedProductId
  //                 ? "Search product type..."
  //                 : "Select product first"
  //             }
  //             loading={productTypeLoading}
  //             options={productTypes.map((type) => ({
  //               value: type.id ?? `${type.product_id}-${type.product_type}`,

  //               label: type.product_code
  //                 ? `${type.product_type} - ${type.product_code}`
  //                 : type.product_type,

  //               data: type,
  //             }))}
  //             onSearch={setProductTypeSearch}
  //             onSelect={(option) =>
  //               handleProductTypeSelect(option.data as ProductTypeDropdownOption)
  //             }
  //             onClear={() => {
  //               setValue("productTypeId", "");

  //               setValue("productType", "");

  //               setProductTypeSearch("");
  //             }}
  //           />
  //           <Input
  //             label="Unit"
  //             type="number"
  //             min={1}
  //             error={errors.units?.message}
  //             {...register("units", {
  //               valueAsNumber: true,

  //               required: "Unit is required",

  //               min: {
  //                 value: 1,
  //                 message: "Minimum 1 unit required",
  //               },
  //             })}
  //           />

  //           <Input
  //             label="Quote"
  //             type="number"
  //             min={0}
  //             placeholder="0"
  //             {...register("quoteAmount", {
  //               valueAsNumber: true,
  //             })}
  //           />

  //           <Input
  //             label="Fault Reported"
  //             placeholder="Enter fault reported by customer"
  //             error={errors.faultReported?.message}
  //             {...register("faultReported", {
  //               required: "Fault reported is required",
  //             })}
  //           />

  //           <div>
  //             <label className="mb-1 block text-sm font-medium text-gray-700">
  //               Type
  //               <span className="ml-1 text-red-500">*</span>
  //             </label>

  //             {/* <select
  //               {...register("complaintType", {
  //                 required: "Complaint type is required",

  //                 onChange: (event) => {
  //                   const type = event.target.value as ComplaintType;

  //                   if (type === "WARRANTY") {
  //                     // User must select old warranty complaint
  //                     setValue("repeatComplaintNumber", "");
  //                     setValue("complaintNumber", "");
  //                   } else {
  //                     setValue("repeatComplaintNumber", "");
  //                     setValue("complaintNumber", generateComplaintNumber());
  //                   }
  //                 },
  //               })}
  //               className={inputClass}
  //             >
  //               <option value="REGULAR">Regular</option>
  //               <option value="REPEAT">Repeat</option>
  //               <option value="WARRANTY">Warranty</option>
  //               <option value="PAID_SERVICE">Paid Service</option>
  //             </select> */}

  //             <select
  //               {...register("complaintType", {
  //                 required: "Complaint type is required",

  //                 onChange: (event) => {
  //                   const type = event.target.value as ComplaintType;

  //                   setValue("repeatComplaintNumber", "");

  //                   if (type !== "WARRANTY") {
  //                     setValue("complaintNumber", generateComplaintNumber());
  //                   }
  //                 },
  //               })}
  //               className={inputClass}
  //             >
  //               <option value="REGULAR">Regular</option>

  //               <option value="REPEAT">Repeat</option>

  //               <option value="WARRANTY">Warranty</option>

  //               <option value="INQUIRY">Inquiry</option>
  //             </select>
  //           </div>
  //         </div>
  //       </Section>

  //       {/* OTHER INFORMATION */}

  //       <Section title="Other Information">
  //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           <Input
  //             label="Ad. Name"
  //             placeholder="Ad. name"
  //             {...register("adName")}
  //           />

  //           {/* Status */}

  //           {/* <div>
  //             <label className="mb-1 block text-sm font-medium text-gray-700">
  //               Status
  //             </label>
  //             <select {...register("status")} className={inputClass}>
  //               <option value="REGISTERED">Registered</option>
  //               <option value="PENDING">Pending</option>
  //               <option value="CANCELLED">Cancelled</option>
  //             </select>
  //           </div> */}

  //           {selectedComplaintType === "WARRANTY" && (
  //             <>
  //               {/* Old Complaint Number */}
  //               <div>
  //                 <label className="mb-1 block text-sm font-medium text-gray-700">
  //                   Old Complaint Number
  //                 </label>

  //                 <input
  //                   {...register("repeatComplaintNumber")}
  //                   readOnly
  //                   placeholder="Select warranty complaint from history"
  //                   className={`${inputClass} cursor-not-allowed bg-gray-50 font-medium text-gray-700`}
  //                 />

  //                 <p className="mt-1 text-xs text-gray-400">
  //                   Select a warranty complaint from complaint history.
  //                 </p>
  //               </div>

  //               {/* New Complaint Number */}
  //               <div>
  //                 <label className="mb-1 block text-sm font-medium text-gray-700">
  //                   New Complaint Number
  //                 </label>

  //                 <input
  //                   {...register("complaintNumber")}
  //                   readOnly
  //                   className={`${inputClass} cursor-not-allowed bg-blue-50 font-semibold text-[#123B7A]`}
  //                 />
  //               </div>
  //             </>
  //           )}
  //         </div>
  //       </Section>

  //       {/* Existing complaint history */}

  //       {/* <ComplaintHistoryTable
  //         history={filteredComplaintHistory}
  //         loading={lookupLoading}
  //         lookupDone={lookupDone}
  //         selectedType={selectedComplaintType}
  //         onWarrantySelect={handleWarrantyHistorySelect}
  //         selectedComplaintNumber={selectedOldComplaintNumber}
  //       /> */}

  //       <ComplaintHistoryTable
  //         history={complaintHistory}
  //         loading={lookupLoading}
  //         lookupDone={lookupDone}
  //         // selectedType={selectedComplaintType}
  //         selectedComplaintNumber={selectedComplaintNumber}
  //         onWarrantySelect={handleWarrantySelect}
  //       />

  //       <div className="flex justify-end">
  //         <button
  //           type="submit"
  //           disabled={submitting}
  //           className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-60"
  //         >
  //           {submitting && <Loader2 size={17} className="animate-spin" />}
  //           {submitting ? "Saving..." : "Save"}
  //         </button>
  //       </div>
  //     </form>
  //   );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-[calc(100vh-120px)] min-h-0 flex-col overflow-hidden"
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-2">
        {/* =====================================
        LEFT SIDE - CREATE COMPLAINT
    ====================================== */}

        <div className="min-h-0 overflow-hidden">
          <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
            {/* FORM CONTENT */}

            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <div className="space-y-3">
                {/* =============================
                CUSTOMER
            ============================== */}

                <CompactSection title="Customer Information">
                  <div className="grid grid-cols-3 gap-x-2.5 gap-y-2">
                    {/* MOBILE */}

                    <div>
                      <label className="mb-0.5 block text-[11px] font-medium leading-4 text-gray-600">
                        Registered Mobile
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <input
                          {...register("customerPhone", {
                            required: "Registered mobile number is required",

                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Enter valid 10 digit mobile number",
                            },
                          })}
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="9876543210"
                          className={inputClass}
                        />

                        {lookupLoading && (
                          <Loader2
                            size={13}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                          />
                        )}
                      </div>

                      {errors.customerPhone && (
                        <ErrorText>{errors.customerPhone.message}</ErrorText>
                      )}
                    </div>

                    {/* ALT PHONE */}

                    <Input
                      label="Alternative Phone"
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                      error={errors.alternatePhone?.message}
                      {...register("alternatePhone", {
                        pattern: {
                          value: /^$|^[0-9]{10}$/,
                          message: "Enter valid 10 digit mobile number",
                        },
                      })}
                    />

                    {/* CUSTOMER NAME */}

                    <Input
                      label="Customer Name"
                      required
                      placeholder="Customer name"
                      error={errors.customerName?.message}
                      {...register("customerName", {
                        required: "Customer name is required",
                      })}
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="mt-2">
                    <ComplaintAddressFields
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      errors={errors}
                    />
                  </div>

                  {/* CUSTOMER FOUND */}

                  {existingCustomer && (
                    <div className="mt-2 flex h-8 items-center justify-between rounded-md border border-green-200 bg-green-50 px-2.5">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <UserCheck
                          size={13}
                          className="shrink-0 text-green-600"
                        />

                        <span className="truncate text-[11px] text-green-700">
                          Existing: <strong>{existingCustomer.name}</strong>
                          {" • "}
                          {existingCustomer.phone}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateCustomer}
                        disabled={updatingCustomer}
                        className="ml-2 shrink-0 text-[11px] font-medium text-[#123B7A] hover:underline"
                      >
                        {updatingCustomer ? "Updating..." : "Update"}
                      </button>
                    </div>
                  )}
                </CompactSection>

                {/* =============================
                PRODUCT
            ============================== */}

                <CompactSection title="Product & Complaint Details">
                  <div className="grid grid-cols-4 gap-x-2.5 gap-y-2">
                    <SearchSelect
                      label="Brand"
                      value={selectedBrand || ""}
                      placeholder="Search brand..."
                      loading={brandLoading}
                      options={brands.map((brand) => ({
                        value: brand.id,
                        label: brand.brandName,
                        data: brand,
                      }))}
                      onSearch={setBrandSearch}
                      onSelect={(option) =>
                        handleBrandSelect(option.data as BrandDropdownOption)
                      }
                      onClear={() => {
                        setValue("brandId", "");
                        setValue("brand", "");
                        setBrandSearch("");
                      }}
                    />

                    <SearchSelect
                      label="Product"
                      value={selectedProductName || ""}
                      placeholder="Search product..."
                      loading={productLoading}
                      options={products.map((product) => ({
                        value: product.product_id,
                        label: product.product_name,
                        data: product,
                      }))}
                      onSearch={setProductSearch}
                      onSelect={(option) =>
                        handleProductSelect(
                          option.data as ProductDropdownOption,
                        )
                      }
                      onClear={() => {
                        setValue("productId", undefined);
                        setValue("productName", "");

                        setValue("productTypeId", "");
                        setValue("productType", "");

                        setValue("category", "");

                        setProductSearch("");
                        setProductTypeSearch("");
                        setCategorySearch("");

                        setProductTypes([]);
                        setCategories([]);
                      }}
                      error={errors.productName?.message}
                    />

                    <SearchSelect
                      label="Category"
                      value={selectedCategory || ""}
                      placeholder={
                        selectedProductId
                          ? "Search category..."
                          : "Select product first"
                      }
                      loading={categoryLoading}
                      options={categories.map((category) => ({
                        value:
                          category.id ??
                          `${category.product_id}-${category.category}`,

                        label: category.category,
                        data: category,
                      }))}
                      onSearch={setCategorySearch}
                      onSelect={(option) =>
                        handleCategorySelect(
                          option.data as CategoryDropdownOption,
                        )
                      }
                      onClear={() => {
                        setValue("category", "");
                        setCategorySearch("");
                      }}
                      error={errors.category?.message}
                    />

                    <SearchSelect
                      label="Product Type"
                      value={selectedProductType || ""}
                      placeholder={
                        selectedProductId
                          ? "Search product type..."
                          : "Select product first"
                      }
                      loading={productTypeLoading}
                      options={productTypes.map((type) => ({
                        value:
                          type.id ?? `${type.product_id}-${type.product_type}`,

                        label: type.product_code
                          ? `${type.product_type} - ${type.product_code}`
                          : type.product_type,

                        data: type,
                      }))}
                      onSearch={setProductTypeSearch}
                      onSelect={(option) =>
                        handleProductTypeSelect(
                          option.data as ProductTypeDropdownOption,
                        )
                      }
                      onClear={() => {
                        setValue("productTypeId", "");
                        setValue("productType", "");
                        setProductTypeSearch("");
                      }}
                    />

                    <Input
                      label="Unit"
                      type="number"
                      min={1}
                      error={errors.units?.message}
                      {...register("units", {
                        valueAsNumber: true,
                        required: "Unit is required",
                        min: {
                          value: 1,
                          message: "Minimum 1 unit required",
                        },
                      })}
                    />

                    <Input
                      label="Quote"
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register("quoteAmount", {
                        valueAsNumber: true,
                      })}
                    />

                    <Input
                      label="Fault Reported"
                      required
                      placeholder="Enter fault"
                      error={errors.faultReported?.message}
                      {...register("faultReported", {
                        required: "Fault reported is required",
                      })}
                    />

                    {/* TYPE */}

                    <div>
                      <label className="mb-0.5 block text-[11px] font-medium leading-4 text-gray-600">
                        Type
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>

                      <select
                        {...register("complaintType", {
                          required: "Complaint type is required",

                          onChange: (event) => {
                            const type = event.target.value as ComplaintType;

                            setValue("repeatComplaintNumber", "");

                            if (type !== "WARRANTY") {
                              setValue(
                                "complaintNumber",
                                generateComplaintNumber(),
                              );
                            }
                          },
                        })}
                        className={inputClass}
                      >
                        <option value="REGULAR">Regular</option>

                        <option value="REPEAT">Repeat</option>

                        <option value="WARRANTY">Warranty</option>

                        <option value="INQUIRY">Inquiry</option>
                      </select>
                    </div>
                  </div>
                </CompactSection>

                {/* =============================
                OTHER INFORMATION
            ============================== */}

                <CompactSection title="Other Information">
                  <div className="grid grid-cols-3 gap-x-2.5 gap-y-2">
                    <Input
                      label="Ad. Name"
                      placeholder="Ad. name"
                      {...register("adName")}
                    />

                    {selectedComplaintType === "WARRANTY" && (
                      <>
                        <Input
                          label="Old Complaint No."
                          readOnly
                          placeholder="Select from history"
                          className="cursor-not-allowed bg-gray-50"
                          {...register("repeatComplaintNumber")}
                        />

                        <Input
                          label="New Complaint No."
                          readOnly
                          className="cursor-not-allowed bg-blue-50 font-semibold text-[#123B7A]"
                          {...register("complaintNumber")}
                        />
                      </>
                    )}
                  </div>
                </CompactSection>
              </div>
            </div>

            {/* =====================================
            SAVE - ALWAYS VISIBLE
        ====================================== */}

            <div className="flex shrink-0 justify-end border-t border-gray-200 px-3 py-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#123B7A] px-4 text-xs font-medium text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}

                {submitting ? "Saving..." : "Save Complaint"}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================
        RIGHT 50% - COMPLAINT HISTORY
    ====================================== */}

        <div className="min-h-0 overflow-hidden">
          <ComplaintHistoryTable
            history={complaintHistory}
            loading={lookupLoading}
            lookupDone={lookupDone}
            selectedComplaintNumber={selectedComplaintNumber}
            onWarrantySelect={handleWarrantySelect}
          />
        </div>
      </div>
    </form>
  );
}

/* =====================================================
   COMPLAINT HISTORY
===================================================== */

interface ComplaintHistoryTableProps {
  history: ComplaintHistoryItem[];
  loading: boolean;
  lookupDone: boolean;
  // selectedType?: ComplaintType;
  onWarrantySelect?: (complaint: ComplaintHistoryItem) => void;
  selectedComplaintNumber?: string;
}

function ComplaintHistoryTable({
  history,
  loading,
  lookupDone,
  // selectedType,
  onWarrantySelect,
  selectedComplaintNumber,
}: ComplaintHistoryTableProps) {
  return (
    // <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"> 
    {/* Header */}

<div className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-3 py-2">
  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50">
    <History
      size={14}
      className="text-[#123B7A]"
    />
  </div>

  <div>
    <h3 className="text-xs font-semibold text-gray-900">
      Complaint History
    </h3>

    <p className="text-[10px] text-gray-500">
      Previous customer complaints
    </p>
  </div>
</div>

      {/* Loading */}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 size={19} className="animate-spin" />
          Searching customer and complaint history...
        </div>
      )}

      {/* Initial State */}

      {!loading && !lookupDone && (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <Search size={30} className="mb-3 text-gray-300" />

          <p className="text-sm font-medium text-gray-700">
            Enter customer mobile number
          </p>

          <p className="mt-1 max-w-md text-xs text-gray-400">
            We will check both registered and alternate mobile numbers and
            display existing complaints here.
          </p>
        </div>
      )}

      {/* No History */}

      {!loading && lookupDone && history.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <CheckCircle2 size={30} className="mb-3 text-green-500" />

          <p className="text-sm font-medium text-gray-700">
            No previous complaints found
          </p>

          <p className="mt-1 text-xs text-gray-400">
            This customer does not currently have any complaint history.
          </p>
        </div>
      )}

      {/* History Table */}

      {!loading && history.length > 0 && (
        // <div className="overflow-x-auto">
        <div className="min-h-0 flex-1 overflow-auto">
<table className="w-full min-w-[1000px] text-left text-xs">
  <thead className="sticky top-0 z-10 bg-gray-50 text-[10px] font-medium uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Complaint No.</th>

                <th className="px-5 py-3">Date</th>

                <th className="px-5 py-3">Product</th>

                <th className="px-5 py-3">Category</th>

                <th className="px-5 py-3">Fault</th>

                <th className="px-5 py-3">Type</th>

                <th className="px-5 py-3">Technician</th>

                <th className="px-5 py-3">Warranty</th>

                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {history.map((complaint) => {
                /*
                |--------------------------------------------------------------------------
                | Warranty comes directly from backend
                |--------------------------------------------------------------------------
                */

                const isUnderWarranty = complaint.isWarranty === true;

                const isSelected =
                  selectedComplaintNumber === complaint.complaintNumber;
console.log(complaint)
                /*
                |--------------------------------------------------------------------------
                | Only allow selecting an under-warranty complaint
                |--------------------------------------------------------------------------
                */

                // const canSelect =
                // selectedType === "WARRANTY" && isUnderWarranty;
                const canSelect = isUnderWarranty;
                return (
                  // <tr
                  //   key={complaint.id || complaint._id}
                  //   onClick={() => {
                  //     if (canSelect) {
                  //       onWarrantySelect?.(complaint);
                  //     }
                  //   }}
                  //   className={`
                  //     transition
                  //     ${canSelect ? "cursor-pointer hover:bg-blue-50" : ""}
                  //     ${
                  //       isSelected
                  //         ? "bg-blue-50 ring-1 ring-inset ring-blue-200"
                  //         : ""
                  //     }
                  //   `}
                  // >
                  <tr
                    key={complaint.id || complaint._id}
                    className={`
    transition
    ${canSelect ? "hover:bg-blue-50" : ""}
    ${isSelected ? "bg-blue-50 ring-1 ring-inset ring-blue-200" : ""}
  `}
                  >
                    {/* Complaint Number */}
                    {/* 
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-[#123B7A]">
                      {complaint.complaintNumber}

                      {canSelect && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          Select
                        </span>
                      )}
                    </td> */}

                    <td className="whitespace-nowrap px-3 py-2 font-medium">
                      {/* {canSelect ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onWarrantySelect?.(complaint);
                          }}
                          className="font-medium text-[#123B7A] underline-offset-2 hover:underline"
                        >
                          {complaint.complaintNumber}
                        </button>
                      ) : (
                        <span className="text-[#123B7A]">
                          {complaint.complaintNumber}
                        </span>
                      )}

                      {canSelect && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          Select
                        </span>
                      )} */}

                      {canSelect ? (
                        <button
                          type="button"
                          onClick={() => {
                            onWarrantySelect?.(complaint);
                          }}
                          className="font-medium text-[#123B7A] underline-offset-2 hover:underline"
                        >
                          {complaint.complaintNumber}
                        </button>
                      ) : (
                        <span className="text-[#123B7A]">
                          {complaint.complaintNumber}
                        </span>
                      )}

                      {canSelect && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          Select
                        </span>
                      )}
                    </td>

                    {/* Date */}

                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {formatDate(complaint.createdAt)}
                    </td>

                    {/* Product */}

                    <td className="px-3 py-2">
                      {complaint.productName || "-"}
                    </td>

                    {/* Category */}

                    <td className="px-3 py-2">
                      {complaint.category
                        ? formatEnum(complaint.category)
                        : "-"}
                    </td>

                    {/* Fault */}

                    <td className="max-w-[250px] px-3 py-2 text-gray-600">
                      {complaint.faultReported || "-"}
                    </td>

                    {/* Type */}

                    <td className="px-3 py-2">
                      {complaint.complaintType
                        ? formatEnum(complaint.complaintType)
                        : "-"}
                    </td>

                    {/* Technician */}

                    <td className="px-3 py-2">
                      {complaint?.allocatedDealerId?.technicianName + " - " + complaint?.allocatedDealerId?.mobileNumber  || "-"}
                    </td>

                    {/* Warranty */}

                    <td className="whitespace-nowrap px-3 py-2">
                      {complaint.isWarranty ? (
                        <div className="flex flex-col items-start gap-1">
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            Under Warranty
                          </span>

                          {complaint.warrantyEndDate && (
                            <span className="text-[11px] text-gray-400">
                              Till {formatDate(complaint.warrantyEndDate)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          No Warranty
                        </span>
                      )}
                    </td>

                    {/* Status */}

                    <td className="px-3 py-2">
                      <StatusBadge status={complaint.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/*  SECTION */

// function Section({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="rounded-xl border border-gray-200 bg-white">
//       <div className="border-b border-gray-200 px-3 py-2">
//         <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//       </div>

//       <div className="p-5">{children}</div>
//     </section>
//   );
// }

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="p-3">{children}</div>
    </section>
  );
}

/* INPUT */

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
// }

// function Input({ label, error, ...props }: InputProps) {
//   return (
//     <div>
//       <label className="mb-1 block text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <input {...props} className={inputClass} />
//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

function Input({ label, error, required, className, ...props }: InputProps) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}

        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <input
        {...props}
        className={`
          ${inputClass}
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : ""
          }
          ${className || ""}
        `}
      />

      {error && (
        <p className="mt-0.5 text-[10px] leading-3 text-red-600">{error}</p>
      )}
    </div>
  );
}

/*  ERROR TEXT */

// function ErrorText({ children }: { children: React.ReactNode }) {
//   return <p className="mt-1 text-xs text-red-600">{children}</p>;
// }

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-0.5 text-[11px] leading-tight text-red-600">{children}</p>
  );
}

/*  STATUS BADGE */

function StatusBadge({ status }: { status: string }) {
  let className = "bg-gray-100 text-gray-700";

  switch (status) {
    case "REGISTERED":
      className = "bg-blue-50 text-blue-700";
      break;

    case "ALLOCATED":
    case "APPOINTMENT_SCHEDULED":
      className = "bg-purple-50 text-purple-700";
      break;

    case "PENDING":
      className = "bg-yellow-50 text-yellow-700";
      break;

    case "WORK_IN_PROGRESS":
      className = "bg-orange-50 text-orange-700";
      break;

    case "WORK_COMPLETED":
    case "DG_VERIFICATION":
      className = "bg-cyan-50 text-cyan-700";
      break;

    case "CLOSED":
      className = "bg-green-50 text-green-700";
      break;

    case "CANCELLED":
      className = "bg-red-50 text-red-700";
      break;
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {formatEnum(status)}
    </span>
  );
}

/*  HELPERS */

function formatEnum(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function CompactSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-gray-200">
      <div className="border-b border-gray-100 bg-gray-50/50 px-2.5 py-1.5">
        <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="p-2.5">{children}</div>
    </section>
  );
}

const inputClass = `
  h-8 w-full rounded-md border border-gray-300 bg-white
  px-2.5 text-xs text-gray-700
  outline-none transition
  placeholder:text-gray-400
  focus:border-blue-500
  focus:ring-1
  focus:ring-blue-100
  disabled:cursor-not-allowed
  disabled:bg-gray-100
  disabled:text-gray-500
`;
