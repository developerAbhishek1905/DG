import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import ApproveCancellationModal from "../components/ApproveCancellationModal";
import CancellationRequestCard from "../components/CancellationRequestCard";
import CustomerVerification from "../components/CustomerVerification";
import ReassignAfterCancellation from "../components/ReassignAfterCancellation";
import RejectCancellationModal from "../components/RejectCancellationModal";

import {
  approveCancellation,
  getCancellationById,
  reassignAfterCancellation,
  rejectCancellation,
  verifyCancellationCustomer,
} from "../services/cancellationApi";

import type {
  ApproveCancellationPayload,
  CancellationRequest,
  ReassignCancellationPayload,
  RejectCancellationPayload,
  VerifyCustomerPayload,
} from "../types/cancellation.types";

export default function CancellationDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    request,
    setRequest,
  ] =
    useState<
      CancellationRequest | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    approveOpen,
    setApproveOpen,
  ] =
    useState(false);

  const [
    rejectOpen,
    setRejectOpen,
  ] =
    useState(false);

  const loadRequest =
    async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data =
          await getCancellationById(
            id
          );

        setRequest(
          data
            ? { ...data }
            : null
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading cancellation request...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Cancellation request not found.
      </div>
    );
  }

  const handleVerify =
    async (
      payload: VerifyCustomerPayload
    ) => {
      const updated =
        await verifyCancellationCustomer(
          payload
        );

      setRequest({
        ...updated,
      });
    };

  const handleApprove =
    async (
      payload: ApproveCancellationPayload
    ) => {
      const updated =
        await approveCancellation(
          payload
        );

      setRequest({
        ...updated,
      });

      setApproveOpen(false);
    };

  const handleReject =
    async (
      payload: RejectCancellationPayload
    ) => {
      const updated =
        await rejectCancellation(
          payload
        );

      setRequest({
        ...updated,
      });

      setRejectOpen(false);
    };

  const handleReassign =
    async (
      payload: ReassignCancellationPayload
    ) => {
      const updated =
        await reassignAfterCancellation(
          payload
        );

      setRequest({
        ...updated,
      });
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <button
          onClick={() =>
            navigate(
              "/cancellations"
            )
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back to Cancellations
        </button>

        {(request.status ===
          "PENDING" ||
          request.status ===
            "VERIFIED") && (
          <div className="flex gap-2">
            <button
              onClick={() =>
                setRejectOpen(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600"
            >
              <XCircle
                size={17}
              />

              Reject
            </button>

            <button
              onClick={() =>
                setApproveOpen(
                  true
                )
              }
              disabled={
                request.verification
                  .status !==
                "VERIFIED"
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              <CheckCircle2
                size={17}
              />

              Approve
            </button>
          </div>
        )}
      </div>

      <CancellationRequestCard
        request={request}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Customer
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              label="Name"
              value={
                request.customer
                  .name
              }
            />

            <Info
              label="Phone"
              value={
                request.customer
                  .phone
              }
            />

            <Info
              label="City"
              value={
                request.customer
                  .city
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Dealer
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              label="Dealer"
              value={
                request.dealer
                  ?.name ??
                "-"
              }
            />

            <Info
              label="Code"
              value={
                request.dealer
                  ?.dealerCode ??
                "-"
              }
            />

            <Info
              label="Phone"
              value={
                request.dealer
                  ?.phone ??
                "-"
              }
            />
          </div>
        </Card>
      </div>

      <CustomerVerification
        request={request}
        onVerify={
          handleVerify
        }
      />

      {request.status ===
        "REJECTED" && (
        <Card className="border-red-200 p-6">
          <h3 className="font-semibold text-red-700">
            Cancellation Rejected
          </h3>

          <p className="mt-3 text-sm text-gray-600">
            {
              request.rejectionReason
            }
          </p>
        </Card>
      )}

      {request.status ===
        "APPROVED" && (
        <Card className="border-green-200 p-6">
          <h3 className="font-semibold text-green-700">
            Cancellation Approved
          </h3>

          <p className="mt-3 text-sm text-gray-600">
            {
              request.approvalRemarks ??
              "Cancellation approved."
            }
          </p>
        </Card>
      )}

      <ReassignAfterCancellation
        request={request}
        onReassign={
          handleReassign
        }
      />

      {request.status ===
        "REASSIGNED" &&
        request.reassignedDealer && (
          <Card className="border-purple-200 p-6">
            <h3 className="font-semibold text-purple-700">
              Complaint Reassigned
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              New Dealer:{" "}
              <strong>
                {
                  request.reassignedDealer
                    .name
                }
              </strong>
            </p>
          </Card>
        )}

      <ApproveCancellationModal
        open={
          approveOpen
        }
        request={
          request
        }
        onClose={() =>
          setApproveOpen(
            false
          )
        }
        onSubmit={
          handleApprove
        }
      />

      <RejectCancellationModal
        open={
          rejectOpen
        }
        request={
          request
        }
        onClose={() =>
          setRejectOpen(
            false
          )
        }
        onSubmit={
          handleReject
        }
      />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}