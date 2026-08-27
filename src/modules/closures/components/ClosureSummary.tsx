import {
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import type {
  ClosureRecord,
} from "../types/closure.types";

interface Props {
  closure: ClosureRecord;
}

export default function ClosureSummary({
  closure,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Closure Submitted
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {closure.id}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {closure.status}
        </span>
      </div>

      <div className="mt-6 grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Complaint"
          value={
            closure.complaintNumber
          }
        />

        <Info
          label="Closure Type"
          value={
            closure.closureType
          }
        />

        <Info
          label="Dealer"
          value={
            closure.dealer.name
          }
        />

        <Info
          label="Closed At"
          value={new Date(
            closure.closedAt
          ).toLocaleString()}
        />
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        <FileCheck2
          size={17}
        />

        {closure.proofs.length} proof file(s) attached
      </div>

      {closure.remarks && (
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Remarks
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {closure.remarks}
          </p>
        </div>
      )}
    </Card>
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

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}