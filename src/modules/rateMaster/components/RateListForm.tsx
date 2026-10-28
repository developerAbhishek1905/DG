import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import SearchSelect, {
  type SearchSelectOption,
} from "../../../components/ui/SearchSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { getProductOptions } from "../services/rateListApi";
import type {
  ProductOption,
  RateFormValues,
  RateListItem,
  RateStatus,
} from "../types/rateList.types";

interface Props {
  rate?: RateListItem;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: RateFormValues) => Promise<void>;
}

export default function RateListForm({ rate, saving, onClose, onSubmit }: Props) {
  const isEdit = Boolean(rate);

  const [title, setTitle] = useState(rate?.title ?? "");
  const [productId, setProductId] = useState<number | null>(rate?.productId ?? null);
  const [productLabel, setProductLabel] = useState(rate?.productName ?? "");
  const [status, setStatus] = useState<RateStatus>(rate?.status ?? "ACTIVE");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [options, setOptions] = useState<SearchSelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingOptions(true);

    getProductOptions(debounced)
      .then((list: ProductOption[]) => {
        if (cancelled) return;
        setOptions(
          list.map((p) => ({
            value: p.product_id,
            label: p.product_name,
            data: p,
          })),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setOptions([]);
        toast.error("Failed to load products");
      })
      .finally(() => !cancelled && setLoadingOptions(false));

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Enter a title");
    if (productId === null) return setError("Select a product");

    setError("");

    try {
      await onSubmit({
        title: title.trim(),
        productId,
        status,
      });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save";
      toast.error(message);
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#123B7A]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit" : "Add"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Enter title"
              autoFocus
            />
          </div>

          <SearchSelect
            label="Product"
            required
            value={productLabel}
            placeholder="Search and select product"
            options={options}
            loading={loadingOptions}
            filterMode="server"
            onSearch={setSearch}
            onSelect={(option) => {
              const p = option.data as ProductOption;
              setProductId(p.product_id);
              setProductLabel(p.product_name);
            }}
            onClear={() => {
              setProductId(null);
              setProductLabel("");
            }}
          />

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RateStatus)}
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
