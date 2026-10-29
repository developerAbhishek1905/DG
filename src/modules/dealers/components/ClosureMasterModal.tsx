import { ListSkeleton } from "../../../components/ui/Skeleton";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getClosureOptions } from "../../rateMaster/services/rateListApi";
import type { RateListItem } from "../../rateMaster/types/rateList.types";
import type { DealerProductClosure } from "../types/dealer.types";

interface Props {
  productId?: number;
  productName?: string;
  selected: DealerProductClosure[];
  onClose: () => void;
  onSave: (closures: DealerProductClosure[]) => void;
}

// The rate is kept as text while typing
type Row = { closureId: string; title: string; rate: string; autoBill: boolean; defaultBill: boolean };

const toRow = (c: DealerProductClosure): Row => ({
  closureId: c.closureId,
  title: c.title,
  rate: c.rate ? String(c.rate) : "",
  autoBill: Boolean(c.autoBill),
  defaultBill: Boolean(c.defaultBill),
});

export default function ClosureMasterModal({
  productId,
  productName,
  selected,
  onClose,
  onSave,
}: Props) {
  const [options, setOptions] = useState<RateListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chosen, setChosen] = useState<Row[]>(selected.map(toRow));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    getClosureOptions(productId)
      .then((list) => !cancelled && setOptions(list))
      .catch(() => {
        if (cancelled) return;
        setOptions([]);
        setFailed(true);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const find = (id: string) => chosen.find((c) => c.closureId === id);

  const toggle = (item: RateListItem) => {
    setError("");
    setChosen((prev) =>
      prev.some((c) => c.closureId === item._id)
        ? prev.filter((c) => c.closureId !== item._id)
        : [
            ...prev,
            { closureId: item._id, title: item.title, rate: "", autoBill: false, defaultBill: false },
          ],
    );
  };

  const setRate = (id: string, rate: string) =>
    setChosen((prev) =>
      prev.map((c) => (c.closureId === id ? { ...c, rate } : c)),
    );

  // Only one closure can be the default bill: ticking it clears the others
  const toggleDefaultBill = (id: string) =>
    setChosen((prev) =>
      prev.map((c) =>
        c.closureId === id
          ? { ...c, defaultBill: !c.defaultBill }
          : { ...c, defaultBill: false },
      ),
    );

  // Auto bill can be ticked on any number of closures
  const toggleAutoBill = (id: string) =>
    setChosen((prev) =>
      prev.map((c) =>
        c.closureId === id ? { ...c, autoBill: !c.autoBill } : c,
      ),
    );

  const allAutoBill = chosen.length > 0 && chosen.every((c) => c.autoBill);

  const toggleAllAutoBill = () =>
    setChosen((prev) => prev.map((c) => ({ ...c, autoBill: !allAutoBill })));

  const allSelected =
    options.length > 0 && options.every((o) => chosen.some((c) => c.closureId === o._id));

  // Select / clear every closure of the list (existing rates are kept)
  const toggleAll = () => {
    setError("");
    setChosen((prev) =>
      allSelected
        ? prev.filter((c) => !options.some((o) => o._id === c.closureId))
        : [
            ...prev,
            ...options
              .filter((o) => !prev.some((c) => c.closureId === o._id))
              .map((o) => ({
                closureId: o._id,
                title: o.title,
                rate: "",
                autoBill: false,
                defaultBill: false,
              })),
          ],
    );
  };

  const handleSave = () => {
    for (const row of chosen) {
      const value = row.rate.trim() === "" ? 0 : Number(row.rate);
      if (!Number.isFinite(value) || value < 0) {
        setError(`Enter a valid rate for ${row.title}`);
        return;
      }
    }

    onSave(
      chosen.map((row) => ({
        closureId: row.closureId,
        title: row.title,
        rate: row.rate.trim() === "" ? 0 : Number(row.rate),
        autoBill: row.autoBill,
        defaultBill: row.defaultBill,
      })),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Closure Master</h3>
            {productName && (
              <p className="text-xs text-gray-500">Product: {productName}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <ListSkeleton rows={5} />
          ) : failed ? (
            <p className="py-6 text-center text-xs text-red-600">
              Failed to load Closure Master.
            </p>
          ) : options.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-500">
              No Closure Master entries found for this product.
            </p>
          ) : (
            <>
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-5 w-5 accent-[#6D28D9]"
                />
                Closure
              </label>
              <span className="w-[100px] shrink-0">Rate</span>
              <span className="w-[84px] shrink-0">Default Bill</span>
              <label className="flex w-[84px] shrink-0 cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  disabled={chosen.length === 0}
                  checked={allAutoBill}
                  onChange={toggleAllAutoBill}
                  className="h-4 w-4 accent-[#6D28D9]"
                />
                Auto Bill
              </label>
            </div>
            <ul className="divide-y divide-gray-100">
              {options.map((item) => {
                const row = find(item._id);
                const on = Boolean(row);

                return (
                  <li
                    key={item._id}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          on
                            ? "border-[#6D28D9] bg-[#6D28D9] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span
                        title={item.title}
                        className={`truncate text-sm ${on ? "font-medium text-gray-900" : "text-gray-700"}`}
                      >
                        {item.title}
                      </span>
                    </button>

                    <div className="flex w-[100px] shrink-0 items-center gap-1">
                      <span className="text-xs text-gray-500">₹</span>
                      <input
                        type="number"
                        min={0}
                        disabled={!row}
                        value={row?.rate ?? ""}
                        onChange={(e) => setRate(item._id, e.target.value)}
                        placeholder="Rate"
                        className="h-8 w-20 rounded-md border border-gray-300 px-2 text-xs outline-none focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>

                    {(["defaultBill", "autoBill"] as const).map((key) => (
                      <label
                        key={key}
                        className={`flex w-[84px] shrink-0 items-center gap-1.5 text-xs ${
                          row ? "cursor-pointer text-gray-700" : "cursor-not-allowed text-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={!row}
                          checked={row?.[key] ?? false}
                          onChange={() =>
                            key === "defaultBill"
                              ? toggleDefaultBill(item._id)
                              : toggleAutoBill(item._id)
                          }
                          className="h-4 w-4 accent-[#6D28D9]"
                        />
                      </label>
                    ))}
                  </li>
                );
              })}
            </ul>
            </>
          )}

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <span className="text-xs text-gray-500">
            {chosen.length} selected · only one Default Bill allowed
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-[#6D28D9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4C1D95]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
