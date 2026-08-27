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

// import {
//   COMPLAINT_CATEGORY_OPTIONS,
//   COMPLAINT_PRIORITY_OPTIONS,
// } from "../constants/complaint.constants";

import {
  createComplaint,
  lookupCustomerByPhone,
} from "../services/complaintApi";

import type {
  Complaint,
  ComplaintHistoryItem,
  ComplaintStatus,
  ComplaintType,
  Customer,
} from "../types/complaint.types";

interface ComplaintFormProps {
  onComplaintCreated?: (
    complaint: Complaint
  ) => void;
}

interface ComplaintFormData {
  complaintNumber: string;
  complaintDateTime: string;

  customerId?: string;

  customerPhone: string;
  customerName: string;
  alternatePhone?: string;

  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  contactInfo?: string;

  productName: string;
  units: number;
  quoteAmount?: number;

  faultReported: string;
  complaintType: ComplaintType;

  adName?: string;

  status: ComplaintStatus;

  repeatComplaintNumber?: string;
}

const formatComplaintDate = (
  date: Date
) => {
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year = String(
    date.getFullYear()
  ).slice(-2);

  return `${day}${month}${year}`;
};

const generateComplaintNumber = () => {
  const now = new Date();

  const datePart =
    formatComplaintDate(now);

  // Temporary frontend sequence
  // Backend should generate this later
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
  formState: { errors },
} = useForm<ComplaintFormData>({
  defaultValues: {
    complaintNumber:
      generateComplaintNumber(),

    complaintDateTime:
      new Date().toISOString(),

    customerId: "",

    customerPhone: "",
    customerName: "",
    alternatePhone: "",

    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    contactInfo: "",

    productName: "",
    units: 1,
    quoteAmount: undefined,

    faultReported: "",

    complaintType: "REGULAR",

    adName: "",

    status: "REGISTERED",

    repeatComplaintNumber: "",
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

    const [currentDateTime, setCurrentDateTime] =
  useState(new Date());

  useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();

    setCurrentDateTime(now);

    setValue(
      "complaintDateTime",
      now.toISOString()
    );
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, [setValue]);
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


  const formatComplaintDate = (
  date: Date
) => {
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year = String(
    date.getFullYear()
  ).slice(-2);

  return `${day}${month}${year}`;
};


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
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-6"
>
  {/* =====================================
      COMPLAINT INFORMATION
  ====================================== */}

<Section title="Complaint Information">
  <div className="grid gap-4 md:grid-cols-2">

    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Complaint Number
      </label>

      <input
        {...register(
          "complaintNumber"
        )}
        readOnly
        className={`${inputClass} cursor-not-allowed bg-gray-50 font-medium text-[#123B7A]`}
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Date / Time
      </label>

      <input
        value={currentDateTime.toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",

            hour12: true,
          }
        )}
        readOnly
        className={`${inputClass} cursor-not-allowed bg-gray-50`}
      />
    </div>

  </div>
</Section>

  {/* =====================================
      CUSTOMER INFORMATION
  ====================================== */}

  <Section title="Customer Information">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      {/* Registered Mobile */}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Registered Mobile Number
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <div className="relative">
          <input
            {...register("customerPhone", {
              required:
                "Registered mobile number is required",

              pattern: {
                value: /^[0-9]{10}$/,
                message:
                  "Enter valid 10 digit mobile number",
              },
            })}
            maxLength={10}
            inputMode="numeric"
            placeholder="9876543210"
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
            {errors.customerPhone.message}
          </ErrorText>
        )}
      </div>

      {/* Customer Name */}

      <Input
        label="Customer Name"
        placeholder="Customer name"
        error={errors.customerName?.message}
        {...register("customerName", {
          required:
            "Customer name is required",
        })}
      />

      {/* Alternative Phone */}

      <Input
        label="Alternative Phone No."
        placeholder="9876543210"
        maxLength={10}
        inputMode="numeric"
        error={errors.alternatePhone?.message}
        {...register("alternatePhone", {
          pattern: {
            value: /^$|^[0-9]{10}$/,
            message:
              "Enter valid 10 digit mobile number",
          },
        })}
      />

      {/* Address */}

      <div className="md:col-span-2 lg:col-span-3">
        <Input
          label="Customer Address"
          placeholder="Enter customer address"
          error={errors.address?.message}
          {...register("address", {
            required:
              "Customer address is required",
          })}
        />
      </div>

      {/* City */}

      <Input
        label="City"
        placeholder="City"
        error={errors.city?.message}
        {...register("city", {
          required:
            "City is required",
        })}
      />

      {/* District */}

      <Input
        label="District"
        placeholder="District"
        {...register("district")}
      />

      {/* State */}

      <Input
        label="State"
        placeholder="State"
        error={errors.state?.message}
        {...register("state", {
          required:
            "State is required",
        })}
      />

      {/* Pin Code */}

      <Input
        label="Pin Code"
        placeholder="452001"
        maxLength={6}
        inputMode="numeric"
        error={errors.pincode?.message}
        {...register("pincode", {
          pattern: {
            value: /^[0-9]{6}$/,
            message:
              "Enter valid 6 digit pin code",
          },
        })}
      />

      {/* Contact Info */}

      <div className="md:col-span-2">
        <Input
          label="Contact Info"
          placeholder="Additional contact information"
          {...register("contactInfo")}
        />
      </div>

    </div>

    {/* Existing Customer Status */}

    {lookupError && (
      <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle size={18} />

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
                className="mt-0.5 text-green-600"
              />

              <div>
                <p className="font-medium text-green-800">
                  Existing Customer Found
                </p>

                <p className="mt-1 text-sm text-green-700">
                  {existingCustomer.name}
                  {" • "}
                  {existingCustomer.phone}
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Customer details have been filled
                  automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              No existing customer found with this
              mobile number. Enter customer details
              to continue.
            </div>
          )}
        </div>
      )}
  </Section>

  {/* =====================================
      PRODUCT INFORMATION
  ====================================== */}

  <Section title="Product & Complaint Details">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      <Input
        label="Product"
        placeholder="Product"
        error={errors.productName?.message}
        {...register("productName", {
          required:
            "Product is required",
        })}
      />

      <Input
        label="Unit"
        type="number"
        min={1}
        error={errors.units?.message}
        {...register("units", {
          valueAsNumber: true,

          required:
            "Unit is required",

          min: {
            value: 1,
            message:
              "Minimum 1 unit required",
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

      <div className="md:col-span-2">
        <Input
          label="Fault Reported"
          placeholder="Enter fault reported by customer"
          error={errors.faultReported?.message}
          {...register("faultReported", {
            required:
              "Fault reported is required",
          })}
        />
      </div>

      {/* Type */}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Type
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <select
          {...register("complaintType", {
            required:
              "Complaint type is required",
          })}
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

    </div>
  </Section>

  {/* =====================================
      OTHER INFORMATION
  ====================================== */}

  <Section title="Other Information">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      <Input
        label="Ad. Name"
        placeholder="Ad. name"
        {...register("adName")}
      />

      {/* Status */}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Status
        </label>

        <select
          {...register("status")}
          className={inputClass}
        >
          <option value="REGISTERED">
            Registered
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>
      </div>

      <Input
        label="Repeat Complaint No."
        placeholder="Previous complaint number"
        {...register(
          "repeatComplaintNumber"
        )}
      />

    </div>
  </Section>

  {/* Existing complaint history */}

  <ComplaintHistoryTable
    history={complaintHistory}
    loading={lookupLoading}
    lookupDone={lookupDone}
  />

  <div className="flex justify-end">
    <button
      type="submit"
      disabled={submitting}
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