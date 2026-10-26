import { useEffect, useMemo, useRef, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { DealerLedger } from "../types/billing.types";
import SearchSelect from "../../../components/ui/SearchSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  searchDealerDropdown,
  searchProductCategories,
} from "../../dealers/services/dealerApi";
import { searchAllCategories } from "../services/billingApi";
import { toast } from "react-toastify";

type BillingType =
  | "FIXED"
  | "PARTIAL_PAYMENT"
  | "PROFIT_SHARING"
  | "CANCELLATION"
  | "OPENING_BALANCE"
  | "ADJUSTMENT";

export interface BillFormValues {
  complaintNumber: string;
  dealerId: string;
  productName: string;
  category: string;
  units: number;
  billingType: BillingType;
  customerAmount: number;
  profitAmount: number;
  percentage: number;
  amount: number;
  closingRemark: string;
}

interface Props {
  mode: "create" | "edit";
  initialData?: DealerLedger | null;
  onClose: () => void;
  onSubmit: (data: BillFormValues) => Promise<void>;
}


/*
 * Number input that can be fully cleared: the typed text is kept as a string
 * so a leading 0 can be removed, and "0" is shown as a placeholder when empty.
 */
function NumberField({
  value,
  onChange,
  className,
  readOnly,
  disabled,
  required,
  placeholder = "0",
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: string | number;
  required?: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState(value ? String(value) : "");

  // keep in sync when the value changes from outside (edit load, calculation)
  useEffect(() => {
    const rounded = Number((Number(value) || 0).toFixed(2));

    if ((Number(text) || 0) !== rounded) {
      setText(rounded ? String(rounded) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      readOnly={readOnly}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        let v = e.target.value.replace(/[^\d.]/g, "");
        const parts = v.split(".");
        if (parts.length > 2) v = `${parts[0]}.${parts.slice(1).join("")}`;
        const [i, d] = v.split(".");
        const cleanInt = i.replace(/^0+(?=\d)/, "");
        v = d !== undefined ? `${cleanInt || "0"}.${d.slice(0, 2)}` : cleanInt;
        setText(v);
        onChange(Number(v) || 0);
      }}
    />
  );
}

const defaultValues: BillFormValues = {
  complaintNumber: "",
  dealerId: "",
  dealerName: "",
  productId: null,
  productName: "",
  categoryId: "",
  category: "",
  units: 1,
  billingType: "FIXED",
  customerAmount: 0,
  profitAmount: 0,
  percentage: 0,
  amount: 0,
  closingRemark: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

export default function BillForm({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<BillFormValues>(defaultValues);
  const [saving, setSaving] = useState(false);

  type DealerOption = {
    _id: string;
    technicianFirmName?: string;
    technicianName?: string;
    headCode?: string;
    name?: string;
    city?: string;
    value?: string;
  };

  type CategoryOption = {
    _id: string;
    category: string;
    description?: string;
    product_id?:
      | number
      | {
          _id: string;
          product_id: number;
          product_name: string;
        };
    product_name?: string;
  };

  const [dealerSearch, setDealerSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [dealers, setDealers] = useState<DealerOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [dealerOpen, setDealerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [dealerLoading, setDealerLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const debouncedDealerSearch = useDebounce(dealerSearch, 400);
  const debouncedCategorySearch = useDebounce(categorySearch, 400);
  const dealerDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryOpen) return;

    let active = true;

    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await searchAllCategories(debouncedCategorySearch);

        if (active) {
          setCategories(response as CategoryOption[]);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [debouncedCategorySearch, categoryOpen]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const dealerName =
        initialData.dealerName ||
        (typeof initialData.dealerId === "object"
          ? initialData.dealerId?.technicianFirmName ||
            initialData.dealerId?.technicianName ||
            ""
          : "");

      const dealerId =
        typeof initialData.dealerId === "string"
          ? initialData.dealerId
          : initialData.dealerId?._id || "";

      const complaint =
        typeof initialData.complaintId === "object"
          ? initialData.complaintId
          : null;

      const categoryName = initialData.category || "";

      setForm({
        complaintNumber:
          initialData.complaintNumber || complaint?.complaintNumber || "",

        dealerId,
        dealerName,

        productId: initialData.productId ?? null,
        productName: initialData.productName || "",

        categoryId: initialData.categoryId || "",
        category: categoryName,

        // Fetch units from populated complaint
        units: complaint?.units ?? initialData.units ?? 1,

        // Auto / dummy / penalty bills are not editable as a form type;
        // the form only knows the manual billing types
        billingType: initialData.billingType as BillFormValues["billingType"],

        // The top-level fields default to 0 in the database while the real
        // values of closure bills are stored in `calculation`, so use `||`
        // (not `??`) to fall back to the calculation values.
        customerAmount:
          Number(initialData.customerAmount) ||
          Number(initialData.calculation?.customerAmount) ||
          0,

        profitAmount:
          Number(initialData.profitAmount) ||
          Number(initialData.calculation?.profitAmount) ||
          0,

        percentage:
          Number(initialData.percentage) ||
          Number(initialData.calculation?.percentage) ||
          0,

        amount: initialData.amount ?? 0,

        // Fetch closing remark from populated complaint
        closingRemark:
          complaint?.closureApprovalRemark || initialData.closingRemark || "",
      });

      setDealerSearch(dealerName);

      setCategorySearch(categoryName);
    } else {
      setForm({ ...defaultValues });

      setDealerSearch("");
      setCategorySearch("");
    }

    setDealerOpen(false);
    setCategoryOpen(false);
  }, [mode, initialData]);

  const updateField = <K extends keyof BillFormValues>(
    field: K,
    value: BillFormValues[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(dealers)

  useEffect(() => {
    let active = true;

    const loadDealers = async () => {
      try {
        setDealerLoading(true);

        const response = await searchDealerDropdown(debouncedDealerSearch);

        if (active) {
          setDealers(response as DealerOption[]);
        }
      } catch (error) {
        console.error("Failed to load dealers:", error);

        if (active) {
          setDealers([]);
        }
      } finally {
        if (active) {
          setDealerLoading(false);
        }
      }
    };

    if (dealerOpen) {
      loadDealers();
    }

    return () => {
      active = false;
    };
  }, [debouncedDealerSearch, dealerOpen]);

  useEffect(() => {
    if (!categoryOpen || form.productId == null) {
      setCategories([]);
      return;
    }

    let active = true;

    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await searchProductCategories({
          productId: form.productId!,
          search: debouncedCategorySearch,
        });

        if (active) {
          setCategories(response as CategoryOption[]);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [form.productId, debouncedCategorySearch, categoryOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dealerDropdownRef.current &&
        !dealerDropdownRef.current.contains(target)
      ) {
        setDealerOpen(false);
      }

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculatedAmount = useMemo(() => {
    if (form.billingType === "PARTIAL_PAYMENT") {
      return (form.customerAmount * form.percentage) / 100;
    }

    if (form.billingType === "PROFIT_SHARING") {
      return (form.profitAmount * form.percentage) / 100;
    }

    return form.amount;
  }, [
    form.billingType,
    form.customerAmount,
    form.profitAmount,
    form.percentage,
    form.amount,
  ]);

  const isPercentageBilling =
    form.billingType === "PARTIAL_PAYMENT" ||
    form.billingType === "PROFIT_SHARING";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form)

    if (!form.dealerId) {
      toast.error("Please select a dealer from dropdown");
      return;
    }

    if (!form.complaintNumber.trim()) {
      return;
    }

    if (!Number.isInteger(form.units) || form.units < 1) {
      return;
    }

    if (
      !Number.isFinite(calculatedAmount) ||
      calculatedAmount < 0 ||
      !Number.isFinite(form.percentage) ||
      form.percentage < 0 ||
      form.percentage > 100
    ) {
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        ...form,
        dealerId: form.dealerId,
        amount: calculatedAmount,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "create" ? "Create Bill" : "Edit Bill"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-6 overflow-y-auto p-6">
            {/* Basic Information */}

            <section>
              <h3 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
                Basic Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Complaint Number *</label>

                  <input
                    required
                    value={form.complaintNumber}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      updateField("complaintNumber", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter complaint number"
                  />
                </div>

                <div ref={dealerDropdownRef} className="relative">
                  <label className={labelClass}>Dealer *</label>

                  <input
                    type="text"
                    value={dealerSearch}
                    placeholder="Search dealer..."
                    onFocus={() => {
                      setDealerOpen(true);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      setDealerSearch(value);
                      setDealerOpen(true);

                      // Selected dealer invalidate only when text changes
                      updateField("dealerId", "");
                      updateField("dealerName", "");
                    }}
                    className={inputClass}
                  />

                  {dealerOpen && (
                    <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {dealerLoading ? (
                        <p className="p-3 text-xs text-gray-500">
                          Loading dealers...
                        </p>
                      ) : dealers.length ? (
                        dealers.map((dealer) => {
                          const dealerName =
                            dealer.technicianFirmName ||
                            dealer.technicianName ||
                            dealer.name ||
                            "";

                          //                               setForm((prev) => ({
                          //     ...prev,
                          //     dealerId: dealer._id,
                          //     dealerName,
                          //   }));

                          //   setDealerSearch(dealerName);
                          //   setDealerOpen(false);

                          return (
                            <button
                              key={dealer.value}
                              type="button"
                              onClick={() => {
                                updateField("dealerId", dealer.value);
                                updateField("dealerName", dealerName);

                                // Keep selected value in input
                                setDealerSearch(dealerName);

                                setDealerOpen(false);
                              }}
                              className="block w-full px-3 py-2.5 text-left hover:bg-gray-50"
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {dealerName}
                              </p>

                              <p className="text-xs text-gray-500">
                                {[
                                  dealer.technicianName,
                                  dealer.city,
                                ]
                                  .filter(Boolean)
                                  .join(" • ") || "-"}
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <p className="p-3 text-xs text-gray-400">
                          No dealers found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Product</label>

                  <input
                    type="text"
                    value={form.productName}
                    readOnly
                    placeholder="Auto-filled from category"
                    className={`${inputClass} cursor-not-allowed bg-gray-50`}
                  />
                </div>

                <div ref={categoryDropdownRef} className="relative">
                  <label className={labelClass}>Category *</label>

                  <input
                    type="text"
                    value={categorySearch}
                    placeholder="Search category..."
                    onFocus={() => setCategoryOpen(true)}
                    onChange={(e) => {
                      const value = e.target.value;

                      setCategorySearch(value);
                      setCategoryOpen(true);

                      setForm((prev) => ({
                        ...prev,
                        categoryId: "",
                        category: "",
                        productId: null,
                        productName: "",
                      }));
                    }}
                    className={inputClass}
                  />

                  {categoryOpen && (
                    <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {categoryLoading ? (
                        <p className="p-3 text-xs text-gray-500">
                          Loading categories...
                        </p>
                      ) : categories.length ? (
                        categories.map((item) => {
                          const label = `${item.category} - ${item.description || ""}`;

                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => {
                                const product =
                                  typeof item.product_id === "object"
                                    ? item.product_id
                                    : null;

                                const productId =
                                  product?.product_id ??
                                  (typeof item.product_id === "number"
                                    ? item.product_id
                                    : null);

                                const productName =
                                  product?.product_name ||
                                  item.product_name ||
                                  "";

                                setForm((prev) => ({
                                  ...prev,

                                  categoryId: item._id,
                                  category: item.category,

                                  productId,
                                  productName,
                                }));

                                setCategorySearch(
                                  `${item.category} - ${item.description || ""}`,
                                );

                                setCategoryOpen(false);
                              }}
                              className="block w-full px-3 py-2.5 text-left hover:bg-gray-50"
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {label}
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <p className="p-3 text-xs text-gray-400">
                          No categories found
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Units *</label>

                  <NumberField
                    min={1}
                    step={1}
                    required
                    value={form.units}
                    onChange={(num) => updateField("units", num)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Billing Type</label>

                  <select
                    value={form.billingType}
                    onChange={(e) =>
                      updateField("billingType", e.target.value as BillingType)
                    }
                    className={inputClass}
                  >
                    <option value="FIXED">Fixed</option>
                    <option value="PARTIAL_PAYMENT">Partial Payment</option>
                    <option value="PROFIT_SHARING">Profit Sharing</option>
                    <option value="CANCELLATION">Cancellation</option>
                    <option value="OPENING_BALANCE">Opening Balance</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Billing Calculation */}

            <section>
              <h3 className="mb-4 border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
                Billing Calculation
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Customer Amount</label>

                  <NumberField
                    min={0}
                    step="0.01"
                    value={form.customerAmount}
                    onChange={(num) => updateField("customerAmount", num)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Profit Amount</label>

                  <NumberField
                    min={0}
                    step="0.01"
                    value={form.profitAmount}
                    onChange={(num) => updateField("profitAmount", num)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Billing Percentage (%)</label>

                  <NumberField
                    min={0}
                    max={100}
                    step="0.01"
                    value={form.percentage}
                    disabled={!isPercentageBilling}
                    onChange={(num) => updateField("percentage", num)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Final Billing Amount</label>

                  <NumberField
                    min={0}
                    step="0.01"
                    value={calculatedAmount}
                    readOnly={isPercentageBilling}
                    onChange={(num) => updateField("amount", num)}
                    className={`${inputClass} font-semibold ${
                      isPercentageBilling ? "bg-gray-50 text-[#123B7A]" : ""
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Closing Remark */}

            <section>
              <div>
                <label className={labelClass}>Closing Remark</label>

                <textarea
                  rows={3}
                  value={form.closingRemark}
                  disabled={mode === "edit"}
                  onChange={(e) => updateField("closingRemark", e.target.value)}
                  placeholder="Enter closing remark..."
                  className={`${inputClass} ${
                    mode === "edit"
                      ? "cursor-not-allowed bg-gray-100 text-gray-500"
                      : ""
                  }`}
                />

                {mode === "edit" && (
                  <p className="mt-1 text-xs text-gray-400">
                    Closing remark cannot be modified while editing a bill.
                  </p>
                )}
              </div>
              {/* <label className={labelClass}>Closing Remark</label>

              <textarea
                rows={3}
                value={form.closingRemark}
                onChange={(e) => updateField("closingRemark", e.target.value)}
                placeholder="Enter closing remark..."
                className={inputClass}
              /> */}
            </section>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3064] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}

              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Create Bill"
                  : "Update Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
