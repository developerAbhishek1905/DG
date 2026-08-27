import Card from "../../../components/ui/Card";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

import type { Complaint } from "../types/complaint.types";

interface Props {
  complaint: Complaint;
}

export default function ComplaintSummary({
  complaint,
}: Props) {
  return (
    <Card className="p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              {complaint.complaintNumber}
            </h2>

            <ComplaintStatusBadge
              status={complaint.status}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {complaint.subject}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-gray-500">
            Created
          </p>

          <p className="text-sm font-medium text-gray-900">
            {new Date(
              complaint.createdAt
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 md:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">
            Category
          </p>
          <p className="mt-1 text-sm font-medium">
            {complaint.category}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Priority
          </p>
          <p className="mt-1 text-sm font-medium">
            {complaint.priority}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Customer
          </p>
          <p className="mt-1 text-sm font-medium">
            {complaint.customer.name}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Phone
          </p>
          <p className="mt-1 text-sm font-medium">
            {complaint.customer.phone}
          </p>
        </div>
      </div>
    </Card>
  );
}