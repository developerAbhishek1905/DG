import { useNavigate, useParams } from "react-router-dom";

export default function EditComplaintPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  return (
    <div>
      <button
        onClick={() => navigate(`/complaints/${id}`)}
        className="mb-5 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to Complaint
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        Edit Complaint
      </h1>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">
          Edit form will be implemented next.
        </p>
      </div>
    </div>
  );
}