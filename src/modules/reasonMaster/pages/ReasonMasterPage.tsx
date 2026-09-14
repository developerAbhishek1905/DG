import { Plus, RefreshCcw, Search } from "lucide-react";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {
  createReason,
  deleteReason,
  getReasons,
  updateReason,
  updateReasonStatus,
} from "../services/reason.api";

// import Pagination from "../components/Pagination";

import ReasonForm from "../components/ReasonForm";
import ReasonTable from "../components/ReasonTable";

import type {
  Pagination as PaginationType,
  Reason,
  ReasonFormData,
  ReasonType,
} from "../types/reason.types";
import Pagination from "../../../components/ui/Pagination";

interface Tab {
  label: string;

  value: ReasonType;
}

const tabs: Tab[] = [
  {
    label: "Close",
    value: "close",
  },

  {
    label: "On Call Pending",
    value: "on_call_pending",
  },

  {
    label: "After Call Pending",
    value: "after_call_pending",
  },

  {
    label: "On Call Cancel",
    value: "on_call_cancel",
  },

  {
    label: "After Call Cancel",
    value: "after_call_cancel",
  },
];

const initialPagination: PaginationType = {
  total: 0,

  page: 1,

  limit: 10,

  totalPages: 0,

  hasNextPage: false,

  hasPreviousPage: false,
};

export default function ReasonMasterPage() {
  const [activeTab, setActiveTab] = useState<ReasonType>("close");

  const [reasons, setReasons] = useState<Reason[]>([]);

  const [loading, setLoading] = useState(false);

  const [formLoading, setFormLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState<"" | "active" | "inactive">("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] =
    useState<PaginationType>(initialPagination);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Debounce Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());

      /*
       * Whenever search changes
       * go back to first page.
       */

      setPage(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  const fetchReasons = async () => {
    try {
      setLoading(true);

      const response = await getReasons({
        reasonType: activeTab,

        search: debouncedSearch || undefined,

        status: status || undefined,

        page,

        limit,
      });

      setReasons(response.data || []);

      setPagination(response.pagination || initialPagination);
    } catch (error: any) {
      console.error("Fetch reasons error:", error);

      toast.error(error?.response?.data?.message || "Failed to fetch reasons");

      setReasons([]);

      setPagination(initialPagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, [activeTab, debouncedSearch, status, page, limit]);

  /*
  |--------------------------------------------------------------------------
  | Tab
  |--------------------------------------------------------------------------
  */

  const handleTabChange = (type: ReasonType) => {
    setActiveTab(type);

    setSearch("");

    setDebouncedSearch("");

    setStatus("");

    setPage(1);

    setSelectedReason(null);

    setFormOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Status Filter
  |--------------------------------------------------------------------------
  */

  const handleStatusFilter = (value: "" | "active" | "inactive") => {
    setStatus(value);

    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Limit Change
  |--------------------------------------------------------------------------
  */

  const handleLimitChange = (value: number) => {
    setLimit(value);

    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Add
  |--------------------------------------------------------------------------
  */

  const handleAddReason = () => {
    setSelectedReason(null);

    setFormOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const handleEdit = (reason: Reason) => {
    setSelectedReason(reason);

    setFormOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Form
  |--------------------------------------------------------------------------
  */

  const handleCloseForm = () => {
    setFormOpen(false);

    setSelectedReason(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (formData: ReasonFormData) => {
    if (!formData.reasonName.trim()) {
      toast.error("Reason name is required");
      return;
    }

    try {
      setFormLoading(true);

      if (selectedReason) {
        const response = await updateReason(selectedReason._id, {
          reasonName: formData.reasonName,
          reasonType: activeTab,
          isActive: formData.isActive,
        });

        toast.success(response.message || "Reason updated successfully");
      } else {
        const response = await createReason({
          reasonName: formData.reasonName,
          reasonType: activeTab,
          isActive: formData.isActive,
        });

        toast.success(response.message || "Reason created successfully");
      }

      handleCloseForm();

      // reload table after create/update
      await fetchReasons();
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to save reason");
    } finally {
      setFormLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Status Change
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (reason: Reason, isActive: boolean) => {
    try {
      const response = await updateReasonStatus(reason._id, isActive);

      toast.success(response.message || "Status updated successfully");

      // reload table
      await fetchReasons();
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (reason: Reason) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${reason.reasonName}"?`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteReason(reason._id);

      toast.success(response.message || "Reason deleted successfully");

      // if last row of current page deleted
      if (reasons.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
        return;
      }

      // reload table
      await fetchReasons();
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to delete reason");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setSearch("");

    setDebouncedSearch("");

    setStatus("");

    setPage(1);
  };

  const activeTabLabel =
    tabs.find((tab) => tab.value === activeTab)?.label || "";

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Reason Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage complaint reasons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddReason}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#032963]"
        >
          <Plus size={18} />
          Add Reason
        </button>
      </div>

      {/* Main Card */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs */}

        <div className="overflow-x-auto">
          <div className="flex min-w-max border-b border-gray-200 px-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  type="button"
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`relative whitespace-nowrap px-5 py-4 text-sm font-medium transition ${
                    isActive
                      ? "text-[#123B7A]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#123B7A]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heading */}

        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTabLabel} Reasons
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage {activeTabLabel.toLowerCase()} reasons.
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            Total: {pagination.total}
          </div>
        </div>

        {/* Filters */}

        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTabLabel.toLowerCase()} reason...`}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={status}
              onChange={(e) =>
                handleStatusFilter(e.target.value as "" | "active" | "inactive")
              }
              className="min-w-[180px] rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCcw size={17} />
              Reset
            </button>
          </div>
        </div>

        {/* Table */}

        <ReasonTable
          reasons={reasons}
          loading={loading}
          page={pagination.page}
          limit={pagination.limit}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        {/* Pagination */}

        {!loading && pagination.total > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Form */}

      <ReasonForm
        open={formOpen}
        selectedType={activeTab}
        reason={selectedReason}
        loading={formLoading}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
