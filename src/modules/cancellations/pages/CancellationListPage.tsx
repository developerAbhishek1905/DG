import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import CancellationTable from "../components/CancellationTable";
import ApproveCancellationModal from "../components/ApproveCancellationModal";
import RejectCancellationModal from "../components/RejectCancellationModal";

import {
  approveCancellation,
  getCancellationRequests,
  rejectCancellation,
} from "../services/cancellationApi";

import {
  clearCancellationFilters,
  closeApproveCancellationModal,
  closeRejectCancellationModal,
  openApproveCancellationModal,
  openRejectCancellationModal,
  setCancellationReason,
  setCancellationSearch,
  setCancellationStatus,
  setCancellationVerification,
} from "../store/cancellationSlice";

import type {
  ApproveCancellationPayload,
  CancellationReasonType,
  CancellationRequest,
  CancellationStatus,
  RejectCancellationPayload,
  VerificationStatus,
} from "../types/cancellation.types";

export default function CancellationListPage() {
  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    reason,
    verification,

    selectedCancellationId,

    approveModalOpen,

    rejectModalOpen,
  } = useAppSelector(
    (state) =>
      state.cancellations
  );

  const [
    requests,
    setRequests,
  ] =
    useState<
      CancellationRequest[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const loadRequests =
    async () => {
      try {
        setLoading(true);

        const data =
          await getCancellationRequests();

        setRequests(data);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered =
    useMemo(
      () =>
        requests.filter(
          (request) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              request.complaintNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              request.customer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              request.dealer?.name
                .toLowerCase()
                .includes(
                  query
                );

            const matchesStatus =
              status === "ALL" ||
              request.status ===
                status;

            const matchesReason =
              reason === "ALL" ||
              request.reason ===
                reason;

            const matchesVerification =
              verification ===
                "ALL" ||
              request.verification
                .status ===
                verification;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesReason &&
              matchesVerification
            );
          }
        ),
      [
        requests,
        search,
        status,
        reason,
        verification,
      ]
    );

  const selectedRequest =
    requests.find(
      (request) =>
        request.id ===
        selectedCancellationId
    );

  const handleApprove =
    async (
      payload: ApproveCancellationPayload
    ) => {
      await approveCancellation(
        payload
      );

      dispatch(
        closeApproveCancellationModal()
      );

      await loadRequests();
    };

  const handleReject =
    async (
      payload: RejectCancellationPayload
    ) => {
      await rejectCancellation(
        payload
      );

      dispatch(
        closeRejectCancellationModal()
      );

      await loadRequests();
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Cancellation Requests
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review, verify and process complaint cancellation requests.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) =>
                dispatch(
                  setCancellationSearch(
                    event.target.value
                  )
                )
              }
              placeholder="Search complaint, customer or dealer..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              dispatch(
                setCancellationStatus(
                  event.target.value as
                    | CancellationStatus
                    | "ALL"
                )
              )
            }
            className="rounded-lg border px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="VERIFIED">
              Verified
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="REASSIGNED">
              Reassigned
            </option>
          </select>

          <select
            value={verification}
            onChange={(event) =>
              dispatch(
                setCancellationVerification(
                  event.target.value as
                    | VerificationStatus
                    | "ALL"
                )
              )
            }
            className="rounded-lg border px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Verification
            </option>

            <option value="NOT_VERIFIED">
              Not Verified
            </option>

            <option value="VERIFIED">
              Verified
            </option>

            <option value="FAILED">
              Failed
            </option>
          </select>

          <select
            value={reason}
            onChange={(event) =>
              dispatch(
                setCancellationReason(
                  event.target.value as
                    | CancellationReasonType
                    | "ALL"
                )
              )
            }
            className="rounded-lg border px-4 py-2.5 text-sm"
          >
            <option value="ALL">
              All Reasons
            </option>

            <option value="CUSTOMER_REQUEST">
              Customer Request
            </option>

            <option value="DEALER_UNAVAILABLE">
              Dealer Unavailable
            </option>

            <option value="DUPLICATE_COMPLAINT">
              Duplicate Complaint
            </option>

            <option value="WRONG_COMPLAINT">
              Wrong Complaint
            </option>

            <option value="OUT_OF_SERVICE_AREA">
              Out of Service Area
            </option>
          </select>

          <button
            onClick={() =>
              dispatch(
                clearCancellationFilters()
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm"
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading cancellation requests...
        </div>
      ) : (
        <CancellationTable
          requests={
            filtered
          }
          onApprove={(id) =>
            dispatch(
              openApproveCancellationModal(
                id
              )
            )
          }
          onReject={(id) =>
            dispatch(
              openRejectCancellationModal(
                id
              )
            )
          }
        />
      )}

      <ApproveCancellationModal
        open={
          approveModalOpen
        }
        request={
          selectedRequest
        }
        onClose={() =>
          dispatch(
            closeApproveCancellationModal()
          )
        }
        onSubmit={
          handleApprove
        }
      />

      <RejectCancellationModal
        open={
          rejectModalOpen
        }
        request={
          selectedRequest
        }
        onClose={() =>
          dispatch(
            closeRejectCancellationModal()
          )
        }
        onSubmit={
          handleReject
        }
      />
    </div>
  );
}