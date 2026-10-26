import { useCallback, useEffect, useState } from "react";

import { usePermission } from "../../../hooks/usePermission";
import { useAppSelector } from "../../../app/hooks";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";


import BillingFilters, {
  type BillingFilterValues,
  type BillingDealerOption,
} from "../components/BillingFilters";

const initialFilters: BillingFilterValues = {
  search: "",
  dealerId: "",
  status: "ALL",
  billingType: "ALL",
  transactionType: "ALL",
  fromDate: "",
  toDate: "",
};
import LedgerTable from "../components/LedgerTable";
import Pagination from "../../../components/ui/Pagination";

import { approveDealerLedger, getDealerLedgers,  createDealerLedger,
  updateDealerLedger, createDummyBill, type DummyBillValues } from "../services/billingApi";
import DummyBillForm from "../components/DummyBillForm";

import type {
  DealerLedger,
  LedgerPagination,
  LedgerSummary,
} from "../types/billing.types";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchDealerDropdown } from "../../dealers/services/dealerApi";
import BillForm, {
  type BillFormValues,
} from "../components/BillForm";

export default function BillListPage() {
  const { hasPermission } = usePermission();
  const isDealerUser = useAppSelector((s) => s.auth.user?.role?.code) === "DEALER";
  const can = (permission: string) => isDealerUser || hasPermission(permission);
  const [ledgers, setLedgers] = useState<DealerLedger[]>([]);

  const [loading, setLoading] = useState(true);

  const [approvingId, setApprovingId] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState<LedgerPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] = useState<LedgerSummary>({
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    totalDebit: 0,
    totalCredit: 0,
    balance: 0,
  });

  const [dealers, setDealers] = useState<BillingDealerOption[]>([]);
  const [dealersLoading, setDealersLoading] = useState(false);
  const [dealerQuery, setDealerQuery] = useState("");
  const [selectedDealerLabel, setSelectedDealerLabel] = useState("");
  const debouncedDealerQuery = useDebounce(dealerQuery, 300);

  const [filters, setFilters] = useState<BillingFilterValues>(initialFilters);
  const [billFormOpen, setBillFormOpen] = useState(false);
  const [dummyBillOpen, setDummyBillOpen] = useState(false);

const [editingLedger, setEditingLedger] =
  useState<DealerLedger | null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);
  /*
  |--------------------------------------------------------------------------
  | Redux filters
  |--------------------------------------------------------------------------
  */

  // const { search, status, type } = useAppSelector((state) => state.billing);

  /*
  |--------------------------------------------------------------------------
  | Load Ledger
  |--------------------------------------------------------------------------
  */


  const handleCreateBill = () => {
  setEditingLedger(null);
  setBillFormOpen(true);
};

const handleEdit = (ledger: DealerLedger) => {
  // if (ledger.status !== "PENDING") {
  //   toast.error("Only pending bills can be edited");
  //   return;
  // }

  setEditingLedger(ledger);
  setBillFormOpen(true);
};

const handleSubmitDummyBill = async (values: DummyBillValues) => {
  try {
    await createDummyBill(values);

    toast.success("Dummy bill created successfully");

    setDummyBillOpen(false);

    await loadLedgers();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to create dummy bill",
    );

    throw error;
  }
};

const handleCloseBillForm = () => {
  setBillFormOpen(false);
  setEditingLedger(null);
};


const handleSubmitBill = async (values: BillFormValues) => {
  console.log("BILL LIST PAGE PAYLOAD:", values);
  try {
    if (editingLedger) {
      await updateDealerLedger(
        editingLedger._id,
        values,
      );

      toast.success("Bill updated successfully");
    } else {
      await createDealerLedger(values);

      toast.success("Bill created successfully");
    }

    handleCloseBillForm();

    // Reload current filters and pagination
    await loadLedgers();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to save bill",
    );

    throw error;
  }
};
  const loadLedgers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDealerLedgers({
        search: debouncedSearch,

        dealerId: filters.dealerId || undefined,

        status: filters.status === "ALL" ? undefined : filters.status,

        billingType:
          filters.billingType === "ALL" ? undefined : filters.billingType,

        transactionType:
          filters.transactionType === "ALL"
            ? undefined
            : filters.transactionType,

        fromDate: filters.fromDate || undefined,

        toDate: filters.toDate || undefined,

        page,

        limit,
      });

      setLedgers(response.data);

      setSummary(response.summary);

      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load ledgers:", error);

      toast.error("Failed to load ledgers");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    filters.dealerId,
    filters.status,
    filters.billingType,
    filters.transactionType,
    filters.fromDate,
    filters.toDate,
    page,
    limit,
  ]);
  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadLedgers();
  }, [loadLedgers]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setDealersLoading(true);

        const result = await searchDealerDropdown(debouncedDealerQuery);

        if (cancelled) return;

        setDealers(
          result.map((dealer) => ({
            _id: dealer.value,
            name:
              dealer.technicianFirmName ||
              dealer.technicianName ||
              dealer.label,
            code: dealer.dealerCode,
          })),
        );
      } catch (error) {
        console.error("Failed to load dealers:", error);
      } finally {
        if (!cancelled) setDealersLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedDealerQuery]);

  const handleDealerSelect = (dealer: BillingDealerOption | null) => {
    setSelectedDealerLabel(
      dealer
        ? dealer.code
          ? `${dealer.name} - ${dealer.code}`
          : dealer.name
        : "",
    );

    setFilters((prev) => ({ ...prev, dealerId: dealer?._id ?? "" }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedDealerLabel("");
    setDealerQuery("");

    setFilters({
      search: "",
      dealerId: "",
      status: "ALL",
      billingType: "ALL",
      transactionType: "ALL",
      fromDate: "",
      toDate: "",
    });

    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Approve
  |--------------------------------------------------------------------------
  */

  const handleApprove = async (ledger: DealerLedger) => {
    try {
      setApprovingId(ledger._id);

      await approveDealerLedger(
        ledger._id,
        "Billing verified and approved by DG",
      );

      toast.success("Ledger approved successfully");

      /*
      |--------------------------------------------------------------------------
      | Reload after approval
      |--------------------------------------------------------------------------
      */

      await loadLedgers();
    } catch (error: any) {
      console.error("Approve ledger failed:", error);

      toast.error(
        error?.response?.data?.message || "Failed to approve ledger",
      );
    } finally {
      setApprovingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | View
  |--------------------------------------------------------------------------
  */

  const handleView = (ledger: DealerLedger) => {
    console.log("View ledger:", ledger);

    // Open modal / navigate later
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {can("billing.generate") && (
        <button
          type="button"
          onClick={handleCreateBill}
          className="flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3064]"
        >
          <Plus size={17} />
          Create Bill
        </button>
        )}

        {can("billing.dummy") && (
        <button
          type="button"
          onClick={() => setDummyBillOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-4 py-2.5 text-sm font-semibold text-[#123B7A] hover:bg-blue-50"
        >
          <Plus size={17} />
          Create Dummy Bill
        </button>
        )}
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Amount</p>

          <p className="mt-2 text-xl font-bold text-gray-900">
            ₹{summary.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Approved</p>

          <p className="mt-2 text-xl font-bold text-green-600">
            ₹{summary.approvedAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Pending</p>

          <p className="mt-2 text-xl font-bold text-yellow-600">
            ₹{summary.pendingAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Balance</p>

          <p className="mt-2 text-xl font-bold text-[#123B7A]">
            ₹{summary.balance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* FILTERS */}

      {/* <BillingFilters /> */}

      <BillingFilters
        filters={filters}
        dealers={dealers}
        dealersLoading={dealersLoading}
        selectedDealerLabel={selectedDealerLabel}
        onDealerSearch={setDealerQuery}
        onDealerSelect={handleDealerSelect}
        total={pagination.total}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />
      {/* TABLE */}

<LedgerTable
  ledgers={ledgers}
  loading={loading}
  approvingId={approvingId}
  onApprove={handleApprove}
  onView={handleView}
  onEdit={handleEdit}
/>

      {/* PAGINATION */}

      {!loading && pagination.total > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Pagination
            page={page}
            totalPages={pagination.totalPages || 1}
            total={pagination.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </div>
      )}

      {dummyBillOpen && (
        <DummyBillForm
          onClose={() => setDummyBillOpen(false)}
          onSubmit={handleSubmitDummyBill}
        />
      )}

      {billFormOpen && (
  <BillForm
    mode={editingLedger ? "edit" : "create"}
    initialData={editingLedger}
    onClose={handleCloseBillForm}
    onSubmit={handleSubmitBill}
  />
)}
    </div>
  );
}
