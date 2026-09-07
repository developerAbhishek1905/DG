// import {
//   ArrowLeft,
//   BarChart3,
//   Edit,
//   Mail,
//   MapPin,
//   Phone,
//   User,
// } from "lucide-react";

// import { useNavigate, useParams } from "react-router-dom";

// import Card from "../../../components/ui/Card";
// import DealerCapacityCard from "../components/DealerCapacityCard";
// import DealerPerformanceCard from "../components/DealerPerformanceCard";
// import DealerStatusBadge from "../components/DealerStatusBadge";

// import { useDealerDetails } from "../hooks/useDealers";

// export default function DealerDetailsPage() {
//   const navigate = useNavigate();

//   const { id } = useParams();

//   const { dealer, loading } = useDealerDetails(id);

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
//         Loading dealer...
//       </div>
//     );
//   }

//   if (!dealer) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         <p className="text-gray-500">Dealer not found.</p>

//         <button
//           onClick={() => navigate("/dealers")}
//           className="mt-4 text-sm font-medium text-blue-600"
//         >
//           Back to Dealers
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <button
//           onClick={() => navigate("/dealers")}
//           className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
//         >
//           <ArrowLeft size={17} />
//           Back to Dealers
//         </button>

//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate(`/dealers/${dealer.id}/performance`)}
//             className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             <BarChart3 size={17} />
//             Performance
//           </button>

//           <button
//             onClick={() => navigate(`/dealers/${dealer.id}/edit`)}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854]"
//           >
//             <Edit size={17} />
//             Edit Dealer
//           </button>
//         </div>
//       </div>

//       <Card className="p-6">
//         <div className="flex flex-col justify-between gap-4 md:flex-row">
//           <div>
//             <div className="flex flex-wrap items-center gap-3">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {dealer.name}
//               </h1>

//               <DealerStatusBadge status={dealer.status} />
//             </div>

//             <p className="mt-1 text-sm text-gray-500">{dealer.dealerCode}</p>
//           </div>

//           <div>
//             <p className="text-xs text-gray-500">Performance Score</p>

//             <p className="text-3xl font-bold text-[#123B7A]">
//               {dealer.performance.performanceScore}
//               /100
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 md:grid-cols-2 xl:grid-cols-4">
//           <Info icon={User} label="Owner" value={dealer.ownerName} />

//           <Info icon={Phone} label="Phone" value={dealer.phone} />

//           <Info icon={Mail} label="Email" value={dealer.email} />

//           <Info
//             icon={MapPin}
//             label="Location"
//             value={`${dealer.city}, ${dealer.state}`}
//           />
//         </div>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <DealerCapacityCard
//           total={dealer.capacity.total}
//           used={dealer.capacity.used}
//         />

//         <DealerPerformanceCard performance={dealer.performance} />
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <Card className="p-5">
//           <h3 className="font-semibold text-gray-900">Supported Products</h3>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {dealer.supportedProducts.map((product) => (
//               <span
//                 key={product}
//                 className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
//               >
//                 {product}
//               </span>
//             ))}
//           </div>
//         </Card>

//         <Card className="p-5">
//           <h3 className="font-semibold text-gray-900">Address</h3>

//           <p className="mt-4 text-sm leading-6 text-gray-600">
//             {dealer.address}
//             <br />
//             {dealer.city}, {dealer.state}
//             <br />
//             {dealer.pincode}
//           </p>
//         </Card>
//       </div>

//       <Card className="p-5">
//         <h3 className="font-semibold text-gray-900">Dealer Rates</h3>

//         <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//           <Rate label="Visit" value={dealer.rates.visit} />

//           <Rate label="Service" value={dealer.rates.service} />

//           <Rate label="Installation" value={dealer.rates.installation} />

//           <Rate label="Uninstallation" value={dealer.rates.uninstallation} />

//           <Rate label="Others" value={dealer.rates.other} />
//         </div>
//       </Card>
//     </div>
//   );
// }

// function Info({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="flex gap-3">
//       <div className="mt-1 text-gray-400">
//         <Icon size={17} />
//       </div>

//       <div>
//         <p className="text-xs text-gray-500">{label}</p>

//         <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
//       </div>
//     </div>
//   );
// }

// function Rate({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-lg bg-gray-50 p-4">
//       <p className="text-xs text-gray-500">{label}</p>

//       <p className="mt-1 text-lg font-semibold text-gray-900">
//         ₹{value.toLocaleString("en-IN")}
//       </p>
//     </div>
//   );
// }

import {
  ArrowLeft,
  BriefcaseBusiness,
  Edit,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/ui/Card";
import DealerStatusBadge from "../components/DealerStatusBadge";

import { useDealerDetails } from "../hooks/useDealers";

export default function DealerDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { dealer, loading } = useDealerDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading dealer...
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">
          Dealer not found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/dealers")}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Dealers
        </button>
      </div>
    );
  }

  const combinedProducts =
    dealer.combinedCapacity?.products ?? [];

  const combinedCapacity =
    Number(
      dealer.combinedCapacity?.capacity ?? 0,
    );

  const individualCapacities =
    dealer.individualCapacities ?? [];

  const totalIndividualCapacity =
    individualCapacities.reduce(
      (total, item) =>
        total + Number(item.capacity || 0),
      0,
    );

  const totalCapacity =
    combinedCapacity +
    totalIndividualCapacity;

  const productServices =
    dealer.productServices ?? [];

  return (
    <div className="space-y-6">
      {/* ======================================
          PAGE ACTIONS
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => navigate("/dealers")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Dealers
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/dealers/${dealer.id}/edit`,
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
        >
          <Edit size={17} />
          Edit Dealer
        </button>
      </div>

      {/* ======================================
          DEALER SUMMARY
      ====================================== */}

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {dealer.technicianFirmName ||
                  dealer.headName ||
                  "-"}
              </h1>

              <DealerStatusBadge
                status={
                  dealer.technicianStatus
                }
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              {dealer.headCode && (
                <span>
                  Head Code:{" "}
                  <span className="font-medium text-gray-700">
                    {dealer.headCode}
                  </span>
                </span>
              )}

              {dealer.technicianCode && (
                <span>
                  Technician Code:{" "}
                  <span className="font-medium text-gray-700">
                    {dealer.technicianCode}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 px-5 py-4">
            <p className="text-xs font-medium text-blue-600">
              Total Capacity
            </p>

            <p className="mt-1 text-3xl font-bold text-[#123B7A]">
              {totalCapacity}
            </p>
          </div>
        </div>

        {/* CONTACT INFO */}

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2 xl:grid-cols-4">
          <Info
            icon={User}
            label="Technician Name"
            value={
              dealer.technicianName || "-"
            }
          />

          <Info
            icon={Phone}
            label="Mobile Number"
            value={
              dealer.mobileNumber || "-"
            }
          />

          <Info
            icon={Mail}
            label="Email"
            value={dealer.email || "-"}
          />

          <Info
            icon={MapPin}
            label="Location"
            value={
              [
                dealer.businessAddress
                  ?.city,
                dealer.businessAddress
                  ?.state,
              ]
                .filter(Boolean)
                .join(", ") || "-"
            }
          />
        </div>
      </Card>

      {/* ======================================
          BASIC INFORMATION
      ====================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Dealer Information
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Head Name"
              value={dealer.headName}
            />

            <DetailItem
              label="Group Head"
              value={
                dealer.groupHead
                  ? formatGroupHead(
                      dealer.groupHead,
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Firm Name"
              value={
                dealer.technicianFirmName
              }
            />

            <DetailItem
              label="Technician Name"
              value={dealer.technicianName}
            />

            <DetailItem
              label="Contact Person"
              value={
                dealer.contactPerson
              }
            />

            <DetailItem
              label="Alternative Number"
              value={
                dealer.alternativeNumber
              }
            />

            <DetailItem
              label="Zone"
              value={dealer.zone}
            />

            <DetailItem
              label="Grade"
              value={dealer.grade}
            />
          </div>
        </Card>

        {/* TAX / ACCOUNT */}

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Tax & Account Information
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="GST Number"
              value={dealer.gstNumber}
            />

            <DetailItem
              label="GST Rate"
              value={
                dealer.gstRate !==
                undefined
                  ? `${dealer.gstRate}%`
                  : "-"
              }
            />

            <DetailItem
              label="PAN Number"
              value={dealer.panNumber}
            />

            <DetailItem
              label="Account Type"
              value={
                dealer.accountType
                  ? formatGroupHead(
                      dealer.accountType,
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Credit Days"
              value={
                dealer.creditDays !==
                undefined
                  ? String(
                      dealer.creditDays,
                    )
                  : "-"
              }
            />

            <DetailItem
              label="Credit Limit"
              value={
                dealer.creditLimit !==
                undefined
                  ? `₹${Number(
                      dealer.creditLimit,
                    ).toLocaleString(
                      "en-IN",
                    )}`
                  : "-"
              }
            />

            <DetailItem
              label="Opening Balance"
              value={
                dealer.openingBalance !==
                undefined
                  ? `₹${Number(
                      dealer.openingBalance,
                    ).toLocaleString(
                      "en-IN",
                    )} ${
                      dealer.openingBalanceType ??
                      ""
                    }`
                  : "-"
              }
            />

            <DetailItem
              label="Account Status"
              value={
                dealer.accountDeactivated
                  ? "Inactive"
                  : "Active"
              }
            />
          </div>
        </Card>
      </div>

      {/* ======================================
          PRODUCT & SERVICES
      ====================================== */}

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness
            size={18}
            className="text-gray-500"
          />

          <h3 className="font-semibold text-gray-900">
            Product & Service Mapping
          </h3>
        </div>

        {productServices.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productServices.map(
              (product, index) => (
                <div
                  key={`${product.productId}-${index}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="font-medium text-gray-900">
                    {product.productName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Product ID:{" "}
                    {product.productId}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.categories
                      ?.length ? (
                      product.categories.map(
                        (category) => (
                          <span
                            key={
                              category.categoryId
                            }
                            className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                          >
                            {
                              category.categoryName
                            }
                          </span>
                        ),
                      )
                    ) : (
                      <span className="text-xs text-gray-400">
                        No services mapped
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">
            No products mapped.
          </p>
        )}
      </Card>

      {/* ======================================
          CAPACITY
      ====================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* COMBINED */}

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Combined Capacity
          </h3>

          <div className="mt-4">
            <p className="text-3xl font-bold text-[#123B7A]">
              {combinedCapacity}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Shared capacity
            </p>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Selected Products
            </p>

            {combinedProducts.length ? (
              <div className="flex flex-wrap gap-2">
                {combinedProducts.map(
                  (product) => (
                    <span
                      key={
                        product.productId
                      }
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                    >
                      {
                        product.productName
                      }
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No combined capacity mapped.
              </p>
            )}
          </div>
        </Card>

        {/* INDIVIDUAL */}

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Individual Capacity
            </h3>

            <div className="text-right">
              <p className="text-xl font-bold text-[#123B7A]">
                {totalIndividualCapacity}
              </p>

              <p className="text-xs text-gray-500">
                Total
              </p>
            </div>
          </div>

          {individualCapacities.length ? (
            <div className="mt-5 divide-y divide-gray-100">
              {individualCapacities.map(
                (item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Product ID:{" "}
                        {item.productId}
                      </p>
                    </div>

                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-900">
                      {item.capacity}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">
              No individual capacity mapped.
            </p>
          )}
        </Card>
      </div>

      {/* ======================================
          ADDRESS
      ====================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <AddressCard
          title="Business Address"
          address={
            dealer.businessAddress
          }
        />

        <AddressCard
          title="Residential Address"
          address={
            dealer.residentialAddress
          }
        />
      </div>

      {/* ======================================
          DOCUMENT INFORMATION
      ====================================== */}

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900">
          Document Information
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Aadhaar Number"
            value={dealer.aadhaarNumber}
          />

          <DetailItem
            label="PAN Number"
            value={dealer.panNumber}
          />

          <DetailItem
            label="Driving Licence"
            value={
              dealer.drivingLicenceNumber
            }
          />
        </div>
      </Card>

      {/* ======================================
          OTHER INFORMATION
      ====================================== */}

      {dealer.otherInfo && (
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Other Information
          </h3>

          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
            {dealer.otherInfo}
          </p>
        </Card>
      )}
    </div>
  );
}

/* ========================================
   INFO
======================================== */

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-gray-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

/* ========================================
   DETAIL ITEM
======================================== */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : "-"}
      </p>
    </div>
  );
}

/* ========================================
   ADDRESS CARD
======================================== */

interface Address {
  addressLine?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode?: string;
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address?: Address;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <MapPin
          size={18}
          className="text-gray-400"
        />

        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="mt-4 text-sm leading-6 text-gray-600">
        {address?.addressLine && (
          <p>{address.addressLine}</p>
        )}

        <p>
          {[
            address?.city,
            address?.district,
          ]
            .filter(Boolean)
            .join(", ") || "-"}
        </p>

        <p>
          {[
            address?.state,
            address?.pinCode,
          ]
            .filter(Boolean)
            .join(" - ")}
        </p>
      </div>
    </Card>
  );
}

/* ========================================
   FORMAT ENUM
======================================== */

function formatGroupHead(
  value: string,
) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}