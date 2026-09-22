// import { useNavigate, useParams } from "react-router-dom";

// export default function EditComplaintPage() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   return (
//     <div>
//       <button
//         onClick={() => navigate(`/complaints/${id}`)}
//         className="mb-5 text-sm text-gray-500 hover:text-gray-900"
//       >
//         ← Back to Complaint
//       </button>

//       <h1 className="text-2xl font-bold text-gray-900">Edit Complaint</h1>

//       <div className="mt-6 rounded-xl border bg-white p-6">
//         <p className="text-sm text-gray-500">
//           Edit form will be implemented next.
//         </p>
//       </div>
//     </div>
//   );
// }


import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ComplaintForm from "../components/ComplaintForm";
import { getComplaintById } from "../services/complaintApi";
import type { Complaint } from "../types/complaint.types";

export default function EditComplaintPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);


  console.log(complaint)
  useEffect(() => {
    if (!id) return;

    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const response = await getComplaintById(id);

        console.log("Edit Complaint:", response);

        setComplaint(response);
      } catch (error) {
        console.error("Failed to load complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">
        Loading complaint...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-10 text-center text-sm text-red-500">
        Complaint not found
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(`/complaints/${id}`)}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={15} />
        Back to Complaint
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Edit Complaint
        </h1>

        <p className="mt-1 text-xs text-[#123B7A]">
          {complaint.complaintNumber}
        </p>
      </div>

      {/* <ComplaintForm /> */}
<ComplaintForm
  mode="edit"
  complaintId={id}
  initialData={complaint}
  onSuccess={() => {
    navigate(`/complaints/${id}`);
  }}
/>
    </div>
  );
}