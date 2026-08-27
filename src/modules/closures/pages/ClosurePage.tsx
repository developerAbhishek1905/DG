import {
  ArrowLeft,
  History,
  Save,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import Card from "../../../components/ui/Card";

import ClosureTypeSelector from "../components/ClosureTypeSelector";
import InstallationClosureForm from "../components/InstallationClosureForm";
import PartClosureForm from "../components/PartClosureForm";
import ProofUploader from "../components/ProofUploader";
import ServiceClosureForm from "../components/ServiceClosureForm";
import UninstallationClosureForm from "../components/UninstallationClosureForm";
import VisitClosureForm from "../components/VisitClosureForm";
import ClosureSummary from "../components/ClosureSummary";

import {
  submitClosure,
} from "../services/closureApi";

import {
  setClosureType,
} from "../store/closureSlice";

import type {
  ClosureProof,
  ClosureRecord,
  InstallationClosureData,
  PartClosureData,
  ServiceClosureData,
  SubmitClosurePayload,
  UninstallationClosureData,
  VisitClosureData,
} from "../types/closure.types";

export default function ClosurePage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    complaintId,
  } =
    useParams<{
      complaintId: string;
    }>();

  const {
    selectedClosureType,
  } = useAppSelector(
    (state) =>
      state.closures
  );

  const [
    proofs,
    setProofs,
  ] =
    useState<
      ClosureProof[]
    >([]);

  const [
    remarks,
    setRemarks,
  ] =
    useState("");

  const [
    submittedClosure,
    setSubmittedClosure,
  ] =
    useState<
      ClosureRecord | null
    >(null);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    visitData,
    setVisitData,
  ] =
    useState<
      VisitClosureData | undefined
    >();

  const [
    partData,
    setPartData,
  ] =
    useState<
      PartClosureData | undefined
    >();

  const [
    serviceData,
    setServiceData,
  ] =
    useState<
      ServiceClosureData | undefined
    >();

  const [
    installationData,
    setInstallationData,
  ] =
    useState<
      InstallationClosureData | undefined
    >();

  const [
    uninstallationData,
    setUninstallationData,
  ] =
    useState<
      UninstallationClosureData | undefined
    >();

  if (!complaintId) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Complaint ID is required.
      </div>
    );
  }

  if (submittedClosure) {
    return (
      <div className="space-y-6">
        <ClosureSummary
          closure={
            submittedClosure
          }
        />

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(
                `/complaints/${complaintId}`
              )
            }
            className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to Complaint
          </button>

          <button
            onClick={() =>
              navigate(
                "/closures/history"
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          >
            View Closure History
          </button>
        </div>
      </div>
    );
  }

  const submitCurrentForm =
    () => {
      const forms = {
        VISIT:
          "visit-closure-form",

        PART:
          "part-closure-form",

        SERVICE:
          "service-closure-form",

        INSTALLATION:
          "installation-closure-form",

        UNINSTALLATION:
          "uninstallation-closure-form",
      };

      if (
        !selectedClosureType
      ) {
        alert(
          "Please select a closure type"
        );

        return;
      }

      document
        .getElementById(
          forms[
            selectedClosureType
          ]
        )
        ?.dispatchEvent(
          new Event(
            "submit",
            {
              bubbles: true,
              cancelable: true,
            }
          )
        );
    };

  const finalizeClosure =
    async (
      typeData:
        | VisitClosureData
        | PartClosureData
        | ServiceClosureData
        | InstallationClosureData
        | UninstallationClosureData
    ) => {
      if (
        !selectedClosureType
      ) {
        return;
      }

      try {
        setSubmitting(true);

        const payload: SubmitClosurePayload =
          {
            complaintId,

            closureType:
              selectedClosureType,

            remarks:
              remarks ||
              undefined,

            proofs,
          };

        switch (
          selectedClosureType
        ) {
          case "VISIT":
            payload.visitData =
              typeData as VisitClosureData;
            break;

          case "PART":
            payload.partData =
              typeData as PartClosureData;
            break;

          case "SERVICE":
            payload.serviceData =
              typeData as ServiceClosureData;
            break;

          case "INSTALLATION":
            payload.installationData =
              typeData as InstallationClosureData;
            break;

          case "UNINSTALLATION":
            payload.uninstallationData =
              typeData as UninstallationClosureData;
            break;
        }

        const closure =
          await submitClosure(
            payload
          );

        setSubmittedClosure(
          closure
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <button
            onClick={() =>
              navigate(
                `/complaints/${complaintId}`
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <ArrowLeft
              size={17}
            />

            Back to Complaint
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Complaint Closure
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete closure details for{" "}
            <strong>
              {complaintId}
            </strong>
            .
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/closures/history"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <History
            size={17}
          />

          Closure History
        </button>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Select Closure Type
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the type that matches the completed work.
        </p>

        <div className="mt-5">
          <ClosureTypeSelector
            value={
              selectedClosureType
            }
            onChange={(
              type
            ) =>
              dispatch(
                setClosureType(
                  type
                )
              )
            }
          />
        </div>
      </Card>

      {selectedClosureType && (
        <Card className="p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Closure Details
          </h2>

          {selectedClosureType ===
            "VISIT" && (
            <VisitClosureForm
              onSubmit={(
                data
              ) => {
                setVisitData(
                  data
                );

                finalizeClosure(
                  data
                );
              }}
            />
          )}

          {selectedClosureType ===
            "PART" && (
            <PartClosureForm
              onSubmit={(
                data
              ) => {
                setPartData(
                  data
                );

                finalizeClosure(
                  data
                );
              }}
            />
          )}

          {selectedClosureType ===
            "SERVICE" && (
            <ServiceClosureForm
              onSubmit={(
                data
              ) => {
                setServiceData(
                  data
                );

                finalizeClosure(
                  data
                );
              }}
            />
          )}

          {selectedClosureType ===
            "INSTALLATION" && (
            <InstallationClosureForm
              onSubmit={(
                data
              ) => {
                setInstallationData(
                  data
                );

                finalizeClosure(
                  data
                );
              }}
            />
          )}

          {selectedClosureType ===
            "UNINSTALLATION" && (
            <UninstallationClosureForm
              onSubmit={(
                data
              ) => {
                setUninstallationData(
                  data
                );

                finalizeClosure(
                  data
                );
              }}
            />
          )}
        </Card>
      )}

      {selectedClosureType && (
        <>
          <Card className="p-6">
            <ProofUploader
              proofs={proofs}
              onChange={
                setProofs
              }
            />
          </Card>

          <Card className="p-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Final Remarks
            </label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target.value
                )
              }
              placeholder="Optional closure remarks..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </Card>

          <div className="flex justify-end">
            <button
              onClick={
                submitCurrentForm
              }
              disabled={
                submitting
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              <Save
                size={17}
              />

              {submitting
                ? "Submitting..."
                : "Submit Closure"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}