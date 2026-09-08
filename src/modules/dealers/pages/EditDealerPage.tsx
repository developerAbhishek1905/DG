

import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DealerForm from "../components/DealerForm";
import { useDealerDetails } from "../hooks/useDealers";
import { updateDealer } from "../services/dealerApi";

import type { DealerFormData } from "../types/dealer.types";

export default function EditDealerPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { dealer, loading } = useDealerDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading dealer...
      </div>
    );
  }

  if (!dealer || !id) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Dealer not found.
      </div>
    );
  }

  const handleUpdate = async (data: DealerFormData) => {
    console.log('dhbfkdb')
    try {
      await updateDealer(id, data);

      toast.success("Dealer updated successfully");

      navigate(`/dealers/${id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update dealer");
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(`/dealers/${id}`)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Dealer
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Dealer</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update dealer information and configuration.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <DealerForm
          dealer={dealer}
          onSubmit={handleUpdate}
          submitLabel="Update Dealer"
        />
      </div>
    </div>
  );
}
