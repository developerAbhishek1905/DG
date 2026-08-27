import {
  AlertCircle,
  CheckCircle2,
  History,
  Loader2,
  Search,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  COMPLAINT_CATEGORY_OPTIONS,
  COMPLAINT_PRIORITY_OPTIONS,
} from "../constants/complaint.constants";

import {
  createComplaint,
  lookupCustomerByPhone,
} from "../services/complaintApi";

import type {
    Complaint,
  ComplaintCategory,
  ComplaintHistoryItem,
  ComplaintPriority,
  ComplaintType,
  Customer,
} from "../types/complaint.types";

interface ComplaintFormProps {
  onComplaintCreated?: (
    complaint: Complaint
  ) => void;
}

interface ComplaintFormData {
  customerId?: string;
  customerCode?: string;

  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  customerEmail?: string;

  address: string;
  city: string;
  district?: string;
  state: string;
  pincode?: string;
  contactInfo?: string;

  productName: string;
  units: number;
  quoteAmount?: number;
  productDescription?: string;

  faultReported: string;

  category: ComplaintCategory;
  priority: ComplaintPriority;
  complaintType: ComplaintType;

  adName?: string;
  repeatComplaintNumber?: string;

  subject: string;
  description: string;
}




export default function ComplaintForm({
  onComplaintCreated,
}: ComplaintFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    defaultValues: {
      customerId: "",
      customerCode: "",

      customerName: "",
      customerPhone: "",
      alternatePhone: "",
      customerEmail: "",

      address: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      contactInfo: "",

      productName: "",
      units: 1,
      quoteAmount: undefined,
      productDescription: "",

      faultReported: "",

      category: "REPAIR",
      priority: "MEDIUM",
      complaintType: "REGULAR",

      adName: "",
      repeatComplaintNumber: "",

      subject: "",
      description: "",
    },
  });

  const customerPhone = watch("customerPhone");
  const alternatePhone = watch("alternatePhone");

  const [existingCustomer, setExistingCustomer] =
    useState<Customer | null>(null);

  const [complaintHistory, setComplaintHistory] =
    useState<ComplaintHistoryItem[]>([]);

  const [lookupLoading, setLookupLoading] =
    useState(false);

  const [lookupDone, setLookupDone] =
    useState(false);

  const [lookupError, setLookupError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Registered Mobile Lookup
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Alternate Mobile Lookup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const phone = alternatePhone?.trim();

    if (!phone || phone.length !== 10) {
      return;
    }

    if (phone === customerPhone) {
      return;
    }

    const timer = setTimeout(() => {
      lookupCustomer(phone);
    }, 500);

    return () => clearTimeout(timer);
  }, [alternatePhone, customerPhone]);

  /*
  |--------------------------------------------------------------------------
  | Customer Lookup
  |--------------------------------------------------------------------------
  */

  const lookupCustomer = async (
    phone: string
  ) => {
    try {
      setLookupLoading(true);
      setLookupDone(false);
      setLookupError(null);

const response =
  await lookupCustomerByPhone(phone);

      setExistingCustomer(response.customer);

      setComplaintHistory(
        response.complaintHistory || []
      );

      if (response.customer) {
        fillCustomerDetails(
          response.customer
        );
      }

      setLookupDone(true);
    } catch (error: any) {
      setExistingCustomer(null);
      setComplaintHistory([]);
      setLookupDone(true);

      setLookupError(
        error?.response?.data?.message ||
          "Unable to search customer"
      );
    } finally {
      setLookupLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Auto Fill Existing Customer
  |--------------------------------------------------------------------------
  */

  const fillCustomerDetails = (
    customer: Customer
  ) => {
    setValue(
      "customerId",
      customer.id
    );

    setValue(
      "customerCode",
      customer.customerCode || ""
    );

    setValue(
      "customerName",
      customer.name || ""
    );

    setValue(
      "customerPhone",
      customer.phone || ""
    );

    setValue(
      "alternatePhone",
      customer.alternatePhone || ""
    );

    setValue(
      "customerEmail",
      customer.email || ""
    );

    setValue(
      "address",
      customer.address || ""
    );

    setValue(
      "city",
      customer.city || ""
    );

    setValue(
      "district",
      customer.district || ""
    );

    setValue(
      "state",
      customer.state || ""
    );

    setValue(
      "pincode",
      customer.pincode || ""
    );

    setValue(
      "contactInfo",
      customer.contactInfo || ""
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (
    data: ComplaintFormData
  ) => {
    try {
      setSubmitting(true);

      console.log(
        "Complaint:",
        data
      );
const createdComplaint =
  await createComplaint({
    customerId: data.customerId,

    customerCode: data.customerCode,

    customerName: data.customerName,

    phone: data.customerPhone,

    alternatePhone: data.alternatePhone,

    email: data.customerEmail,

    address: data.address,

    city: data.city,

    district: data.district,

    state: data.state,

    pincode: data.pincode,

    contactInfo: data.contactInfo,

    productName: data.productName,

    units: Number(data.units),

    quoteAmount: data.quoteAmount
      ? Number(data.quoteAmount)
      : undefined,

    productDescription:
      data.productDescription,

    faultReported:
      data.faultReported,

    category: data.category,

    priority: data.priority,

    complaintType:
      data.complaintType,

    adName: data.adName,

    repeatComplaintNumber:
      data.repeatComplaintNumber,

    subject: data.subject,

    description: data.description,
  });

onComplaintCreated?.(
  createdComplaint
);
    } catch (error) {
      console.error(
        "Create complaint error:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      {/* =====================================
          CUSTOMER INFORMATION
      ====================================== */}

      <Section title="Customer Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Registered Mobile */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Registered Mobile Number
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <input
                {...register(
                  "customerPhone",
                  {
                    required:
                      "Phone number is required",

                    pattern: {
                      value:
                        /^[0-9]{10}$/,
                      message:
                        "Enter valid 10 digit mobile number",
                    },
                  }
                )}
                maxLength={10}
                inputMode="numeric"
                placeholder="9988776655"
                className={inputClass}
              />

              {lookupLoading && (
                <Loader2
                  size={17}
                  className="absolute right-3 top-3 animate-spin text-gray-400"
                />
              )}
            </div>

            {errors.customerPhone && (
              <ErrorText>
                {
                  errors
                    .customerPhone
                    .message
                }
              </ErrorText>
            )}
          </div>

          {/* Alternate Mobile */}

          <Input
            label="Alternate Mobile Number"
            maxLength={10}
            inputMode="numeric"
            placeholder="9988776644"
            error={
              errors.alternatePhone
                ?.message
            }
            {...register(
              "alternatePhone",
              {
                pattern: {
                  value:
                    /^$|^[0-9]{10}$/,
                  message:
                    "Enter valid 10 digit mobile number",
                },
              }
            )}
          />

          {/* Customer Code */}

          <Input
            label="Customer Code"
            placeholder="Customer code"
            {...register(
              "customerCode"
            )}
          />

          {/* Customer Name */}

          <Input
            label="Customer Name"
            placeholder="Customer name"
            error={
              errors.customerName
                ?.message
            }
            {...register(
              "customerName",
              {
                required:
                  "Customer name is required",
              }
            )}
          />

          {/* Email */}

          <Input
            label="Email"
            type="email"
            placeholder="Customer email"
            {...register(
              "customerEmail"
            )}
          />

          {/* Pincode */}

          <Input
            label="Pin Code"
            maxLength={6}
            inputMode="numeric"
            placeholder="Pin code"
            {...register(
              "pincode"
            )}
          />

          {/* Address */}

          <div className="md:col-span-2">
            <Input
              label="Customer Address"
              placeholder="Customer address"
              error={
                errors.address
                  ?.message
              }
              {...register(
                "address",
                {
                  required:
                    "Address is required",
                }
              )}
            />
          </div>

          {/* City */}

          <Input
            label="City"
            placeholder="City"
            error={
              errors.city?.message
            }
            {...register(
              "city",
              {
                required:
                  "City is required",
              }
            )}
          />

          {/* District */}

          <Input
            label="District"
            placeholder="District"
            {...register(
              "district"
            )}
          />

          {/* State */}

          <Input
            label="State"
            placeholder="State"
            error={
              errors.state?.message
            }
            {...register(
              "state",
              {
                required:
                  "State is required",
              }
            )}
          />

          {/* Contact Info */}

          <Input
            label="Contact Info"
            placeholder="Additional contact information"
            {...register(
              "contactInfo"
            )}
          />
        </div>

        {/* ===============================
            CUSTOMER LOOKUP STATUS
        ================================ */}

        {lookupError && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={18}
            />

            {lookupError}
          </div>
        )}

        {lookupDone &&
          !lookupError && (
            <div className="mt-5">
              {existingCustomer ? (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <UserCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="font-medium text-green-800">
                      Existing Customer
                      Found
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      {
                        existingCustomer.name
                      }

                      {existingCustomer.customerCode
                        ? ` • Customer Code: ${existingCustomer.customerCode}`
                        : ""}
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      Customer
                      information has
                      been filled
                      automatically.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  No existing
                  customer found with
                  this mobile number.
                  You can register a
                  new customer with
                  this complaint.
                </div>
              )}
            </div>
          )}
      </Section>

      {/* =====================================
          PRODUCT / COMPLAINT INFORMATION
      ====================================== */}

      <Section title="Complaint Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Product */}

          <Input
            label="Product"
            placeholder="Product name"
            error={
              errors.productName
                ?.message
            }
            {...register(
              "productName",
              {
                required:
                  "Product is required",
              }
            )}
          />

          {/* Units */}

          <Input
            label="Units"
            type="number"
            min={1}
            error={
              errors.units?.message
            }
            {...register(
              "units",
              {
                required:
                  "Units are required",

                valueAsNumber:
                  true,

                min: {
                  value: 1,
                  message:
                    "Minimum 1 unit required",
                },
              }
            )}
          />

          {/* Quote Amount */}

          <Input
            label="Quote Amount"
            type="number"
            min={0}
            placeholder="0"
            {...register(
              "quoteAmount",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          {/* Complaint Type */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Complaint Type
            </label>

            <select
              {...register(
                "complaintType"
              )}
              className={inputClass}
            >
              <option value="REGULAR">
                Regular
              </option>

              <option value="REPEAT">
                Repeat
              </option>

              <option value="WARRANTY">
                Warranty
              </option>

              <option value="PAID_SERVICE">
                Paid Service
              </option>
            </select>
          </div>

          {/* Product Description */}

          <div className="md:col-span-2">
            <Input
              label="Product Description"
              placeholder="Example: LED Repair"
              {...register(
                "productDescription"
              )}
            />
          </div>

          {/* Fault Reported */}

          <div className="md:col-span-2">
            <Input
              label="Fault Reported"
              placeholder="Describe reported fault"
              error={
                errors.faultReported
                  ?.message
              }
              {...register(
                "faultReported",
                {
                  required:
                    "Fault reported is required",
                }
              )}
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              {...register(
                "category",
                {
                  required:
                    "Category is required",
                }
              )}
              className={inputClass}
            >
              <option value="">
                Select category
              </option>

              {COMPLAINT_CATEGORY_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>

            {errors.category && (
              <ErrorText>
                {
                  errors.category
                    .message
                }
              </ErrorText>
            )}
          </div>

          {/* Priority */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Priority
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              {...register(
                "priority",
                {
                  required:
                    "Priority is required",
                }
              )}
              className={inputClass}
            >
              <option value="">
                Select priority
              </option>

              {COMPLAINT_PRIORITY_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>

            {errors.priority && (
              <ErrorText>
                {
                  errors.priority
                    .message
                }
              </ErrorText>
            )}
          </div>

          {/* Ad Name */}

          <Input
            label="Ad. Name"
            placeholder="Ad name"
            {...register(
              "adName"
            )}
          />

          {/* Repeat Complaint Number */}

          <Input
            label="Repeat Complaint No."
            placeholder="Previous complaint number"
            {...register(
              "repeatComplaintNumber"
            )}
          />

          {/* Subject */}

          <div className="md:col-span-2">
            <Input
              label="Subject"
              placeholder="Complaint subject"
              error={
                errors.subject
                  ?.message
              }
              {...register(
                "subject",
                {
                  required:
                    "Subject is required",
                }
              )}
            />
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Description
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              rows={4}
              placeholder="Enter complaint details..."
              {...register(
                "description",
                {
                  required:
                    "Description is required",
                }
              )}
              className={`${inputClass} resize-none`}
            />

            {errors.description && (
              <ErrorText>
                {
                  errors.description
                    .message
                }
              </ErrorText>
            )}
          </div>
        </div>
      </Section>

      {/* =====================================
          COMPLAINT HISTORY
      ====================================== */}

      <ComplaintHistoryTable
        history={
          complaintHistory
        }
        loading={
          lookupLoading
        }
        lookupDone={
          lookupDone
        }
      />

      {/* =====================================
          ACTION BUTTON
      ====================================== */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            submitting
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          {submitting
            ? "Creating..."
            : "Create Complaint"}
        </button>
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
}

function ComplaintHistoryTable({
  history,
  loading,
  lookupDone,
}: ComplaintHistoryTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <History
            size={18}
            className="text-[#123B7A]"
          />
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Complaint History
          </h3>

          <p className="text-xs text-gray-500">
            Previous complaints
            registered against the
            customer's mobile
            numbers.
          </p>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2
            size={19}
            className="animate-spin"
          />

          Searching customer and
          complaint history...
        </div>
      )}

      {/* Initial State */}

      {!loading &&
        !lookupDone && (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Search
              size={30}
              className="mb-3 text-gray-300"
            />

            <p className="text-sm font-medium text-gray-700">
              Enter customer mobile
              number
            </p>

            <p className="mt-1 max-w-md text-xs text-gray-400">
              We will check both
              registered and
              alternate mobile
              numbers and display
              existing complaints
              here.
            </p>
          </div>
        )}

      {/* No History */}

      {!loading &&
        lookupDone &&
        history.length ===
          0 && (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <CheckCircle2
              size={30}
              className="mb-3 text-green-500"
            />

            <p className="text-sm font-medium text-gray-700">
              No previous complaints
              found
            </p>

            <p className="mt-1 text-xs text-gray-400">
              This customer does not
              currently have any
              complaint history.
            </p>
          </div>
        )}

      {/* History Table */}

      {!loading &&
        history.length >
          0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">
                    Complaint No.
                  </th>

                  <th className="px-5 py-3">
                    Date
                  </th>

                  <th className="px-5 py-3">
                    Product
                  </th>

                  <th className="px-5 py-3">
                    Category
                  </th>

                  <th className="px-5 py-3">
                    Fault
                  </th>

                  <th className="px-5 py-3">
                    Type
                  </th>

                  <th className="px-5 py-3">
                    Technician
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {history.map(
                  (
                    complaint
                  ) => (
                    <tr
                      key={
                        complaint.id
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-[#123B7A]">
                        {
                          complaint.complaintNumber
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(
                          complaint.createdAt
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.productName ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {formatEnum(
                          complaint.category
                        )}
                      </td>

                      <td className="max-w-[250px] px-5 py-4 text-gray-600">
                        {complaint.faultReported ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.complaintType
                          ? formatEnum(
                              complaint.complaintType
                            )
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.technicianName ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
    </section>
  );
}

/* =====================================================
   SECTION
===================================================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

/* =====================================================
   INPUT
===================================================== */

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

/* =====================================================
   ERROR TEXT
===================================================== */

function ErrorText({
  children,
}: {
  children:
    | React.ReactNode;
}) {
  return (
    <p className="mt-1 text-xs text-red-600">
      {children}
    </p>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let className =
    "bg-gray-100 text-gray-700";

  switch (status) {
    case "REGISTERED":
      className =
        "bg-blue-50 text-blue-700";
      break;

    case "ALLOCATED":
    case "APPOINTMENT_SCHEDULED":
      className =
        "bg-purple-50 text-purple-700";
      break;

    case "PENDING":
      className =
        "bg-yellow-50 text-yellow-700";
      break;

    case "WORK_IN_PROGRESS":
      className =
        "bg-orange-50 text-orange-700";
      break;

    case "WORK_COMPLETED":
    case "DG_VERIFICATION":
      className =
        "bg-cyan-50 text-cyan-700";
      break;

    case "CLOSED":
      className =
        "bg-green-50 text-green-700";
      break;

    case "CANCELLED":
      className =
        "bg-red-50 text-red-700";
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

/* =====================================================
   HELPERS
===================================================== */

function formatEnum(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function formatDate(
  value: string
) {
  if (!value) return "-";

  return new Date(
    value
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";