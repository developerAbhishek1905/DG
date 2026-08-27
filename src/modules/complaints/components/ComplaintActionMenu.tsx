import {
  MoreVertical,
  Eye,
  Edit,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

interface Props {
  complaintId: string;
}

export default function ComplaintActionMenu({
  complaintId,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() =>
          navigate(`/complaints/${complaintId}`)
        }
        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        title="View"
      >
        <Eye size={17} />
      </button>

      <button
        onClick={() =>
          navigate(
            `/complaints/${complaintId}/edit`
          )
        }
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        title="Edit"
      >
        <Edit size={17} />
      </button>

      <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
        <MoreVertical size={17} />
      </button>
    </div>
  );
}