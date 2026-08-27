import { ArrowLeft, Edit, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ComplaintSummary from "../components/ComplaintSummary";
import ComplaintLifecycle from "../components/ComplaintLifecycle";
import ComplaintTimeline from "../components/ComplaintTimeline";
import CustomerInfoCard from "../components/CustomerInfoCard";
import ProductInfoCard from "../components/ProductInfoCard";
import DealerInfoCard from "../components/DealerInfoCard";

import { useComplaintDetails } from "../hooks/useComplaintDetails";

export default function ComplaintDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { complaint, loading } = useComplaintDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading complaint...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-gray-500">Complaint not found.</p>

        <button
          onClick={() => navigate("/complaints")}
          className="mt-4 text-sm font-medium text-blue-600"
        >
          Back to complaints
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Complaints
        </button>

        <button
          onClick={() => navigate(`/complaints/${id}/edit`)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit size={16} />
          Edit
        </button>
{[
  "IN_PROGRESS",
  "APPOINTMENT_COMPLETED",
  "SERVICE_COMPLETED",
].includes(
  complaint.status
) && (
        <button
          onClick={() => navigate(`/closures/${complaint.id}`)}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white"
        >
          <CheckCircle2 size={17} />
          Close Complaint
        </button>
        )}
      </div>
      

      {/* Summary */}
      <ComplaintSummary complaint={complaint} />

      {/* Lifecycle */}
      <ComplaintLifecycle currentStatus={complaint.status} />

      {/* Information */}
      <div className="grid gap-5 lg:grid-cols-3">
        <CustomerInfoCard customer={complaint.customer} />

        <ProductInfoCard product={complaint.product} />

        {/* <DealerInfoCard
          dealer={complaint.dealer}
        /> */}

        <DealerInfoCard
          complaintId={complaint.id}
          dealer={complaint.dealer}
          allocationStatus={complaint.dealer ? "ASSIGNED" : "UNASSIGNED"}
        />
      </div>

      {/* Description */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold text-gray-900">
          Complaint Description
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {complaint.description}
        </p>
      </div>

      {/* Timeline */}
      <ComplaintTimeline timeline={complaint.timeline} />
    </div>
  );
}
