import {
  ArrowLeft,
  CheckCircle2,
  FileImage,
  FileWarning,
  Phone,
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

import CorrectionRequestModal from "../components/CorrectionRequestModal";
import RejectVerificationModal from "../components/RejectVerificationModal";
import VerificationCard from "../components/VerificationCard";
import VerifyComplaintModal from "../components/VerifyComplaintModal";

import {
  getVerificationById,
  rejectVerification,
  requestCorrection,
  startVerification,
  verifyComplaint,
} from "../services/verificationApi";

import type {
  CorrectionRequestPayload,
  RejectVerificationPayload,
  VerificationRecord,
  VerifyComplaintPayload,
} from "../types/verification.types";

export default function VerificationDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    verification,
    setVerification,
  ] =
    useState<
      VerificationRecord | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    verifyOpen,
    setVerifyOpen,
  ] =
    useState(false);

  const [
    rejectOpen,
    setRejectOpen,
  ] =
    useState(false);

  const [
    correctionOpen,
    setCorrectionOpen,
  ] =
    useState(false);

  const loadVerification =
    async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data =
          await getVerificationById(
            id
          );

        setVerification(
          data
            ? { ...data }
            : null
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadVerification();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading verification...
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Verification record not found.
      </div>
    );
  }

  const handleStartReview =
    async () => {
      const updated =
        await startVerification(
          verification.id
        );

      setVerification({
        ...updated,
      });
    };

  const handleVerify =
    async (
      payload: VerifyComplaintPayload
    ) => {
      const updated =
        await verifyComplaint(
          payload
        );

      setVerification({
        ...updated,
      });

      setVerifyOpen(false);
    };

  const handleReject =
    async (
      payload: RejectVerificationPayload
    ) => {
      const updated =
        await rejectVerification(
          payload
        );

      setVerification({
        ...updated,
      });

      setRejectOpen(false);
    };

  const handleCorrection =
    async (
      payload: CorrectionRequestPayload
    ) => {
      const updated =
        await requestCorrection(
          payload
        );

      setVerification({
        ...updated,
      });

      setCorrectionOpen(
        false
      );
    };

  const finished =
    [
      "VERIFIED",
      "REJECTED",
    ].includes(
      verification.status
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <button
          onClick={() =>
            navigate(
              "/verification"
            )
          }
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft
            size={17}
          />

          Back to Verification Queue
        </button>

        {!finished && (
          <div className="flex flex-wrap gap-2">
            {verification.status ===
              "PENDING" && (
              <button
                onClick={
                  handleStartReview
                }
                className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-700"
              >
                Start Review
              </button>
            )}

            <button
              onClick={() =>
                setCorrectionOpen(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2.5 text-sm font-medium text-amber-700"
            >
              <FileWarning
                size={17}
              />

              Request Correction
            </button>

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
                setVerifyOpen(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <CheckCircle2
                size={17}
              />

              Verify
            </button>
          </div>
        )}
      </div>

      <VerificationCard
        verification={
          verification
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Customer Information
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              label="Customer"
              value={
                verification.customer
                  .name
              }
            />

            <Info
              icon={Phone}
              label="Phone"
              value={
                verification.customer
                  .phone
              }
            />

            <Info
              label="City"
              value={
                verification.customer
                  .city
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Dealer Information
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              label="Dealer"
              value={
                verification.dealer
                  .name
              }
            />

            <Info
              label="Dealer Code"
              value={
                verification.dealer
                  .dealerCode
              }
            />

            <Info
              icon={Phone}
              label="Phone"
              value={
                verification.dealer
                  .phone ??
                "-"
              }
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900">
          Closure Details
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Info
            label="Closure ID"
            value={
              verification.closure
                .closureId
            }
          />

          <Info
            label="Closure Type"
            value={
              verification.closure
                .closureType
            }
          />

          <Info
            label="Submitted By"
            value={
              verification.closure
                .submittedBy
            }
          />
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500">
            Work Summary
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-700">
            {
              verification.closure
                .workSummary
            }
          </p>
        </div>

        {verification.closure
          .remarks && (
          <div className="mt-5">
            <p className="text-xs text-gray-500">
              Closure Remarks
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {
                verification.closure
                  .remarks
              }
            </p>
          </div>
        )}

        {verification.closure
          .amount !==
          undefined && (
          <div className="mt-5">
            <p className="text-xs text-gray-500">
              Service Amount
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹
              {
                verification.closure
                  .amount
              }
            </p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900">
          Closure Proofs
        </h3>

        {verification.closure
          .proofs.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {verification.closure.proofs.map(
              (proof) => (
                <div
                  key={
                    proof.id
                  }
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                    <FileImage
                      size={18}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {
                        proof.name
                      }
                    </p>

                    <p className="text-xs text-gray-400">
                      {(
                        proof.size /
                        1024
                      ).toFixed(
                        1
                      )}{" "}
                      KB
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-red-500">
            No proof uploaded.
          </p>
        )}
      </Card>

      {verification.status ===
        "CORRECTION_REQUIRED" && (
        <Card className="border-amber-200 bg-amber-50 p-6">
          <h3 className="font-semibold text-amber-800">
            Correction Required
          </h3>

          <p className="mt-3 text-sm leading-6 text-amber-700">
            {
              verification.correctionReason
            }
          </p>

          <p className="mt-3 text-xs text-amber-600">
            Correction count:{" "}
            {
              verification.correctionCount
            }
          </p>
        </Card>
      )}

      {verification.status ===
        "VERIFIED" && (
        <Card className="border-green-200 bg-green-50 p-6">
          <h3 className="font-semibold text-green-700">
            Verification Completed
          </h3>

          <p className="mt-3 text-sm text-green-700">
            Verified by{" "}
            <strong>
              {
                verification.verifiedBy
              }
            </strong>
            .
          </p>

          {verification.verificationRemarks && (
            <p className="mt-3 text-sm text-green-700">
              {
                verification.verificationRemarks
              }
            </p>
          )}
        </Card>
      )}

      {verification.status ===
        "REJECTED" && (
        <Card className="border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-700">
            Verification Rejected
          </h3>

          <p className="mt-3 text-sm text-red-700">
            {
              verification.rejectionReason
            }
          </p>
        </Card>
      )}

      <VerifyComplaintModal
        open={
          verifyOpen
        }
        verification={
          verification
        }
        onClose={() =>
          setVerifyOpen(
            false
          )
        }
        onSubmit={
          handleVerify
        }
      />

      <RejectVerificationModal
        open={
          rejectOpen
        }
        verification={
          verification
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

      <CorrectionRequestModal
        open={
          correctionOpen
        }
        verification={
          verification
        }
        onClose={() =>
          setCorrectionOpen(
            false
          )
        }
        onSubmit={
          handleCorrection
        }
      />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon
          size={17}
          className="mt-1 text-gray-400"
        />
      )}

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}