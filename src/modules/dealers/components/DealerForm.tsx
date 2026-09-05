import { useEffect, useState } from "react";
import {
  getCategoryDropdown,
  type CategoryDropdown,
} from "../../categoryMaster/services/categoryApi";
import {
  searchProducts,
  type ProductDropdownOption,
} from "../services/dealerApi";

import { useForm } from "react-hook-form";
import {
  useFieldArray,
  // useForm,
} from "react-hook-form";

import type { Dealer, DealerFormData } from "../types/dealer.types";
import AddressFields from "../components/AddressFields";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import ProductServiceFields from "../components/ProductServiceFields";

import SearchSelect from "../../../components/ui/SearchSelect";

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
  // const [categories, setCategories] = useState<CategoryDropdown[]>([]);
  // const [categoriesLoading, setCategoriesLoading] = useState(false);
  // const [categoriesError, setCategoriesError] = useState("");
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState("");
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState("");

  const [panFrontPreview, setPanFrontPreview] = useState("");
  const [panBackPreview, setPanBackPreview] = useState("");

  const [drivingFrontPreview, setDrivingFrontPreview] = useState("");
  const [drivingBackPreview, setDrivingBackPreview] = useState("");
  const [otherDocuments, setOtherDocuments] = useState<File[]>([]);

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

      drivingLicenceNumber: dealer?.drivingLicenceNumber ?? "",

      // productId: dealer?.productId ?? "",
      // productServiceType: dealer?.productServiceType ?? "",

      productServices: dealer?.productServices?.length
        ? dealer.productServices
        : [
            {
              productId: undefined,
              productName: "",
              categories: [],
            },
          ],

      technicianStatus: dealer?.technicianStatus ?? "ACTIVE",
      headCode: dealer?.headCode ?? "",

      groupHead: dealer?.groupHead ?? "",

      headName: dealer?.headName ?? "",

      grade: dealer?.grade ?? "",

      // address: dealer?.address?.length
      //   ? dealer.address
      //   : [
      //       {
      //         addressLine: "",
      //       },
      //     ],

      // city: dealer?.city ?? "",

      // district: dealer?.district ?? "",

      // state: dealer?.state ?? "",

      // stateCode: dealer?.stateCode ?? "",

      // pinCode: dealer?.pinCode ?? "",
      businessAddress: {
        addressLine: dealer?.businessAddress?.addressLine ?? "",
        city: dealer?.businessAddress?.city ?? "",
        district: dealer?.businessAddress?.district ?? "",
        state: dealer?.businessAddress?.state ?? "",
        stateCode: dealer?.businessAddress?.stateCode ?? "",
        pinCode: dealer?.businessAddress?.pinCode ?? "",
      },

      residentialAddress: {
        addressLine: dealer?.residentialAddress?.addressLine ?? "",
        city: dealer?.residentialAddress?.city ?? "",
        district: dealer?.residentialAddress?.district ?? "",
        state: dealer?.residentialAddress?.state ?? "",
        stateCode: dealer?.residentialAddress?.stateCode ?? "",
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

      // capacityMaster: dealer?.capacityMaster?.length
      //   ? dealer.capacityMaster
      //   : [
      //       {
      //         categoryId: "",
      //         rate: 0,
      //         capacity: 0,
      //         serviceType: "",
      //       },
      //     ],

      capacityType: dealer?.capacityType ?? "INDIVIDUAL",

      combinedCapacity: dealer?.combinedCapacity ?? {
        products: [],
        capacity: 0,
      },

      capacityMaster: dealer?.capacityMaster?.length
        ? dealer.capacityMaster
        : [
            {
              productId: undefined,
              productName: "",
              capacity: 0,
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
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: "productServices",
  });

  // useEffect(() => {
  //   const loadCategories = async () => {
  //     try {
  //       setCategoriesLoading(true);
  //       setCategoriesError("");

  //       const data = await getCategoryDropdown();

  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);

  //       setCategoriesError("Unable to load categories");
  //     } finally {
  //       setCategoriesLoading(false);
  //     }
  //   };

  //   loadCategories();
  // }, []);

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

      // address: dealer.address ?? "",

      // city: dealer.city ?? "",

      // district: dealer.district ?? "",

      // state: dealer.state ?? "",

      // stateCode: dealer.stateCode ?? "",

      // pinCode: dealer.pinCode ?? "",

      businessAddress: {
        addressLine: dealer.businessAddress?.addressLine ?? "",
        city: dealer.businessAddress?.city ?? "",
        district: dealer.businessAddress?.district ?? "",
        state: dealer.businessAddress?.state ?? "",
        stateCode: dealer.businessAddress?.stateCode ?? "",
        pinCode: dealer.businessAddress?.pinCode ?? "",
      },

      residentialAddress: {
        addressLine: dealer.residentialAddress?.addressLine ?? "",
        city: dealer.residentialAddress?.city ?? "",
        district: dealer.residentialAddress?.district ?? "",
        state: dealer.residentialAddress?.state ?? "",
        stateCode: dealer.residentialAddress?.stateCode ?? "",
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

      productServices: dealer?.productServices?.length
        ? dealer.productServices
        : [
            {
              productId: undefined,
              productName: "",
              categories: [],
            },
          ],

      openingBalanceType: dealer.openingBalanceType,
      capacityType: dealer?.capacityType ?? "INDIVIDUAL",

      combinedCapacity: dealer?.combinedCapacity ?? {
        products: [],
        capacity: 0,
      },

      // capacityMaster: dealer.capacityMaster?.length
      //   ? dealer.capacityMaster
      //   : [
      //       {
      //         categoryId: "",
      //         rate: 0,
      //         capacity: 0,
      //         serviceType: "",
      //       },
      //     ],

      capacityMaster: dealer?.capacityMaster?.length
        ? dealer.capacityMaster
        : [
            {
              productId: undefined,
              productName: "",
              capacity: 0,
            },
          ],
    });
  }, [dealer, reset]);

  const capacityType = watch("capacityType");

  const combinedCapacityProducts = watch("combinedCapacity.products") || [];

  const individualCapacities = watch("capacityMaster") || [];

  const handleCapacityTypeChange = (type: "COMBINED" | "INDIVIDUAL") => {
    setValue("capacityType", type);

    if (type === "COMBINED") {
      setValue("combinedCapacity", {
        products: [],
        capacity: 0,
      });

      setValue("capacityMaster", []);
    } else {
      setValue("combinedCapacity", {
        products: [],
        capacity: 0,
      });

      setValue("capacityMaster", [
        {
          productId: undefined,
          productName: "",
          capacity: 0,
        },
      ]);
    }
  };

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

  const submitForm = async (data: DealerFormData) => {
    const payload: DealerFormData = {
      ...data,

      gstRate: Number(data.gstRate || 0),

      reverseChargeLimit: Number(data.reverseChargeLimit || 0),

      creditDays: Number(data.creditDays || 0),

      creditLimit: Number(data.creditLimit || 0),

      rating: Number(data.rating || 0),

      openingBalance: Number(data.openingBalance || 0),

      combinedCapacity: {
        products:
          data.capacityType === "COMBINED"
            ? data.combinedCapacity.products
            : [],

        capacity:
          data.capacityType === "COMBINED"
            ? Number(data.combinedCapacity.capacity || 0)
            : 0,
      },

      capacityMaster:
        data.capacityType === "INDIVIDUAL"
          ? data.capacityMaster.map((item) => ({
              productId: item.productId,

              productName: item.productName,

              capacity: Number(item.capacity),
            }))
          : [],
    };

    await onSubmit(payload);
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

          <Input
            label="Head Name"
            error={errors.headName?.message}
            {...register("headName", {
              required: "Head name is required",
            })}
          />
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
        <div className="space-y-8">
          <AddressFields
            type="businessAddress"
            title="Business Address"
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />

          <div className="border-t border-gray-200 pt-6">
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
      <Section title="Identity & Documents">
        <div className="space-y-8">
          {/* ================================================= */}
          {/* AADHAAR */}
          {/* ================================================= */}

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Aadhaar Card
            </h4>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Aadhaar Card Number"
                maxLength={12}
                inputMode="numeric"
                placeholder="Enter 12 digit Aadhaar number"
                error={errors.aadhaarNumber?.message}
                {...register("aadhaarNumber", {
                  // required: "Aadhaar number is required",

                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: "Enter valid 12 digit Aadhaar number",
                  },
                })}
              />

              {/* Aadhaar Front */}

              <div>
                <label className={labelClass}>Aadhaar Front</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("aadhaarFrontFile", {
                    // required: !dealer
                    //   ? "Aadhaar front document is required"
                    //   : false,

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

                {aadhaarFrontPreview && (
                  <ImagePreview
                    src={aadhaarFrontPreview}
                    label="Aadhaar Front Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(aadhaarFrontPreview);

                      setAadhaarFrontPreview("");

                      resetField("aadhaarFrontFile");
                    }}
                  />
                )}
              </div>

              {/* Aadhaar Back */}

              <div>
                <label className={labelClass}>Aadhaar Back</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("aadhaarBackFile", {
                    // required: !dealer
                    //   ? "Aadhaar back document is required"
                    //   : false,

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

                {aadhaarBackPreview && (
                  <ImagePreview
                    src={aadhaarBackPreview}
                    label="Aadhaar Back Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(aadhaarBackPreview);

                      setAadhaarBackPreview("");

                      resetField("aadhaarBackFile");
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* PAN */}
          {/* ================================================= */}

          <div className="border-t border-gray-200 pt-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              PAN Card
            </h4>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="PAN Card Number"
                maxLength={10}
                placeholder="ABCDE1234F"
                error={errors.panNumber?.message}
                {...register("panNumber", {
                  // required: "PAN card number is required",

                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Enter valid PAN number",
                  },

                  onChange: (event) => {
                    event.target.value = event.target.value.toUpperCase();
                  },
                })}
              />

              {/* PAN Front */}

              <div>
                <label className={labelClass}>PAN Front</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("panFrontFile", {
                    // required: !dealer
                    //   ? "PAN front document is required"
                    //   : false,

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
                  <ErrorText>{errors.panFrontFile.message as string}</ErrorText>
                )}

                {panFrontPreview && (
                  <ImagePreview
                    src={panFrontPreview}
                    label="PAN Front Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(panFrontPreview);

                      setPanFrontPreview("");

                      resetField("panFrontFile");
                    }}
                  />
                )}
              </div>

              {/* PAN Back */}

              <div>
                <label className={labelClass}>PAN Back</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("panBackFile", {
                    // required: !dealer ? "PAN back document is required" : false,

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
                  <ErrorText>{errors.panBackFile.message as string}</ErrorText>
                )}

                {panBackPreview && (
                  <ImagePreview
                    src={panBackPreview}
                    label="PAN Back Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(panBackPreview);

                      setPanBackPreview("");

                      resetField("panBackFile");
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* DRIVING LICENCE */}
          {/* ================================================= */}

          <div className="border-t border-gray-200 pt-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Driving Licence
            </h4>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Driving Licence Number"
                placeholder="Enter driving licence number"
                error={errors.drivingLicenceNumber?.message}
                {...register("drivingLicenceNumber", {
                  // required: "Driving licence number is required",
                })}
              />

              {/* Driving Front */}

              <div>
                <label className={labelClass}>Driving Licence Front</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("drivingLicenceFrontFile", {
                    // required: !dealer
                    //   ? "Driving licence front document is required"
                    //   : false,

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

                {drivingFrontPreview && (
                  <ImagePreview
                    src={drivingFrontPreview}
                    label="Driving Licence Front Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(drivingFrontPreview);

                      setDrivingFrontPreview("");

                      resetField("drivingLicenceFrontFile");
                    }}
                  />
                )}
              </div>

              {/* Driving Back */}

              <div>
                <label className={labelClass}>Driving Licence Back</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  {...register("drivingLicenceBackFile", {
                    // required: !dealer
                    //   ? "Driving licence back document is required"
                    //   : false,

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

                {drivingBackPreview && (
                  <ImagePreview
                    src={drivingBackPreview}
                    label="Driving Licence Back Preview"
                    onRemove={() => {
                      URL.revokeObjectURL(drivingBackPreview);

                      setDrivingBackPreview("");

                      resetField("drivingLicenceBackFile");
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* OTHER DOCUMENTS */}
          {/* ================================================= */}

          <div className="border-t border-gray-200 pt-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Other Documents
            </h4>

            <div>
              <label className={labelClass}>
                Upload Documents
                <span className="ml-1 text-xs font-normal text-gray-500">
                  (Maximum 5)
                </span>
              </label>

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                {...register("documentUpload", {
                  // validate: (files) => {
                  //   if (!files) {
                  //     return true;
                  //   }

                  //   return (
                  //     files.length <= 5 || "You can upload maximum 5 documents"
                  //   );
                  // },

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
                <ErrorText>{errors.documentUpload.message as string}</ErrorText>
              )}

              <p className="mt-1 text-xs text-gray-500">
                Maximum 5 files. JPG, PNG, WEBP and PDF files are allowed.
              </p>

              {otherDocumentPreviews.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {otherDocumentPreviews.map((document, index) => (
                    <div
                      key={`${document.name}-${index}`}
                      className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      {/* REMOVE BUTTON */}

                      <button
                        type="button"
                        onClick={() => removeOtherDocument(index)}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                        title="Remove document"
                      >
                        <X size={16} />
                      </button>

                      {/* PREVIEW */}

                      {document.type.startsWith("image/") ? (
                        <img
                          src={document.url}
                          alt={document.name}
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center bg-gray-100">
                          <span className="text-sm font-semibold text-red-600">
                            PDF
                          </span>
                        </div>
                      )}

                      {/* FILE NAME */}

                      <div className="p-2">
                        <p
                          className="truncate text-xs text-gray-700"
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
          <Input label="GST No." {...register("gstNumber")} />

          <Input label="TIN No." {...register("tinNumber")} />

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
        </div>
      </Section>

      <Section title="Credit Information">
        <div className="grid gap-4 md:grid-cols-2">
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

      <Section title="Opening Balance & Other Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <Section title="Capacity Master">
        <div className="space-y-6">
          {/* ======================================== */}
          {/* CAPACITY TYPE */}
          {/* ======================================== */}

          <div>
            <label className={labelClass}>Capacity Type</label>

            <div className="mt-2 flex flex-wrap gap-4">
              {/* COMBINED */}

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
                    Multiple products share one capacity
                  </p>
                </div>
              </label>

              {/* INDIVIDUAL */}

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
                    Separate capacity for each product
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ======================================== */}
          {/* COMBINED CAPACITY */}
          {/* ======================================== */}

          {capacityType === "COMBINED" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Combined Capacity
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Select multiple products and assign one shared capacity.
                </p>

                <div className="mt-4">
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
                        toast.error("Product already selected.");
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

                {combinedCapacityProducts.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-gray-600">
                      Selected Products
                    </p>

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
                            className="text-blue-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="hidden"
                  {...register("combinedCapacity.products", {
                    validate: (products) =>
                      products?.length > 0 ||
                      "Please select at least one product",
                  })}
                />

                {errors.combinedCapacity?.products && (
                  <ErrorText>
                    {errors.combinedCapacity.products.message as string}
                  </ErrorText>
                )}

                <div className="mt-5 max-w-md">
                  <label className={labelClass}>Combined Capacity</label>

                  <input
                    type="number"
                    min={1}
                    placeholder="Enter combined capacity"
                    {...register("combinedCapacity.capacity", {
                      required: "Combined capacity is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Capacity must be greater than 0",
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
            </div>
          )}

          {/* ======================================== */}
          {/* INDIVIDUAL CAPACITY */}
          {/* ======================================== */}

          {capacityType === "INDIVIDUAL" && (
            <div className="space-y-4">
              <div className="hidden grid-cols-[2fr_1fr_auto] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                <div>Product</div>

                <div>Capacity</div>

                <div>Action</div>
              </div>

              {capacityFields.map((field, index) => {
                const item = individualCapacities[index];

                return (
                  <div
                    key={field.id}
                    className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[2fr_1fr_auto]"
                  >
                    {/* PRODUCT */}

                    <div>
                      <SearchSelect
                        label="Product"
                        value={item?.productName ?? ""}
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
                            `capacityMaster.${index}.productId`,
                            product.product_id,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );

                          setValue(
                            `capacityMaster.${index}.productName`,
                            product.product_name,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );
                        }}
                        onClear={() => {
                          setValue(
                            `capacityMaster.${index}.productId`,
                            undefined,
                            {
                              shouldValidate: true,
                            },
                          );

                          setValue(`capacityMaster.${index}.productName`, "");
                        }}
                        error={
                          errors.capacityMaster?.[index]?.productId
                            ?.message as string
                        }
                      />

                      {/* REGISTER PRODUCT */}

                      <input
                        type="hidden"
                        {...register(`capacityMaster.${index}.productId`, {
                          required: "Product is required",
                        })}
                      />
                    </div>

                    {/* CAPACITY */}

                    <div>
                      <label className={labelClass}>Capacity</label>

                      <input
                        type="number"
                        min={1}
                        placeholder="Enter capacity"
                        {...register(`capacityMaster.${index}.capacity`, {
                          required: "Capacity is required",

                          valueAsNumber: true,

                          min: {
                            value: 1,

                            message: "Capacity must be greater than 0",
                          },
                        })}
                        className={inputClass}
                      />

                      {errors.capacityMaster?.[index]?.capacity && (
                        <ErrorText>
                          {errors.capacityMaster[index]?.capacity?.message}
                        </ErrorText>
                      )}
                    </div>

                    {/* REMOVE */}

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeCapacity(index)}
                        disabled={capacityFields.length === 1}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ADD PRODUCT */}

              <button
                type="button"
                onClick={() =>
                  appendCapacity({
                    productId: undefined,
                    productName: "",
                    capacity: 0,
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-medium text-[#123B7A] hover:bg-blue-50"
              >
                <Plus size={17} />
                Add Product
              </button>
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

interface ImagePreviewProps {
  src: string;
  label: string;
  onRemove: () => void;
}

function ImagePreview({ src, label, onRemove }: ImagePreviewProps) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-medium text-gray-600">{label}</p>

      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <img src={src} alt={label} className="h-40 w-full object-contain" />

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
          title="Remove image"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const validateFileSize = (files?: FileList) => {
  if (!files?.length) {
    return true;
  }

  return files[0].size <= MAX_FILE_SIZE || "File size must be less than 5 MB";
};
