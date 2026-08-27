import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintTable from "../components/ComplaintTable";

import { useComplaints } from "../hooks/useComplaints";

import { useAppSelector } from "../../../app/hooks";

export default function ComplaintListPage() {
  const navigate = useNavigate();

  const { complaints, loading } = useComplaints();

  const { search, selectedStatus } =
    useAppSelector((state) => state.complaints);

  const filteredComplaints = complaints.filter(
    (complaint) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        complaint.complaintNumber
          .toLowerCase()
          .includes(searchValue) ||
        complaint.customer.name
          .toLowerCase()
          .includes(searchValue) ||
        complaint.customer.phone.includes(searchValue);

      const matchesStatus =
        selectedStatus === "ALL" ||
        complaint.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complaints
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer complaints
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/complaints/create")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus size={18} />
          Create Complaint
        </button>
      </div>

      {/* Filters */}
      <ComplaintFilters />

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Loading complaints...
          </p>
        </div>
      ) : (
        <ComplaintTable
          complaints={filteredComplaints}
        />
      )}
    </div>
  );
}