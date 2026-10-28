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
type Row = { closureId: string; title: string; rate: string; autoBill: boolean };

const toRow = (c: DealerProductClosure): Row => ({
  closureId: c.closureId,
  title: c.title,
  rate: c.rate ? String(c.rate) : "",
  autoBill: Boolean(c.autoBill),
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
            { closureId: item._id, title: item.title, rate: "", autoBill: false },
          ],
    );
  };

  const setRate = (id: string, rate: string) =>
    setChosen((prev) =>
      prev.map((c) => (c.closureId === id ? { ...c, rate } : c)),
    );

  // Only one closure can be the auto-bill one: ticking it clears the others
  const toggleAutoBill = (id: string) =>
    setChosen((prev) =>
      prev.map((c) =>
        c.closureId === id
          ? { ...c, autoBill: !c.autoBill }
          : { ...c, autoBill: false },
      ),
    );

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
      })),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-xl">
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
            <p className="py-6 text-center text-xs text-gray-500">Loading...</p>
          ) : failed ? (
            <p className="py-6 text-center text-xs text-red-600">
              Failed to load Closure Master.
            </p>
          ) : options.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-500">
              No Closure Master entries found for this product.
            </p>
          ) : (
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
                            ? "border-[#123B7A] bg-[#123B7A] text-white"
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

                    <div className="flex shrink-0 items-center gap-1">
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

                    <label
                      className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${
                        row ? "cursor-pointer text-gray-700" : "cursor-not-allowed text-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!row}
                        checked={row?.autoBill ?? false}
                        onChange={() => toggleAutoBill(item._id)}
                        className="h-4 w-4 accent-[#123B7A]"
                      />
                      Auto Bill
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <span className="text-xs text-gray-500">
            {chosen.length} selected · only one Auto Bill allowed
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
              className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
