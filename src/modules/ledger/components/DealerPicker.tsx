import { useEffect, useRef, useState } from "react";

import { useDebounce } from "../../../hooks/useDebounce";
import { searchAccountDealers, type AccountDealer } from "../services/ledgerApi";

type Props = {
  value: AccountDealer | null;
  onChange: (dealer: AccountDealer | null) => void;
  excludeIds?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const labelOf = (dealer: AccountDealer) =>
  `${dealer.headCode} — ${dealer.dealerName}`;

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DealerPicker({
  value,
  onChange,
  excludeIds = [],
  placeholder = "Search dealer...",
  className = "",
  disabled = false,
}: Props) {
  const [text, setText] = useState(value ? labelOf(value) : "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AccountDealer[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(text, 350);

  // Keep the text in sync when the parent selects / clears the dealer
  useEffect(() => {
    setText(value ? labelOf(value) : "");
  }, [value]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    // Do not search for the label of the already selected dealer
    const query = value && debounced === labelOf(value) ? "" : debounced;

    setLoading(true);

    searchAccountDealers(query)
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, open, value]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setText(value ? labelOf(value) : "");
      }
    };

    document.addEventListener("mousedown", onClick);

    return () => document.removeEventListener("mousedown", onClick);
  }, [value]);

  const visible = options.filter(
    (item) => !excludeIds.includes(item.dealerId),
  );

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <input
        type="text"
        disabled={disabled}
        value={text}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);

          if (value) onChange(null);
        }}
        className={className}
      />

      {open && (
        <div className="absolute z-30 mt-1 max-h-56 w-full min-w-[260px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading ? (
            <p className="p-3 text-xs text-gray-500">Loading dealers...</p>
          ) : visible.length === 0 ? (
            <p className="p-3 text-xs text-gray-500">No dealers found</p>
          ) : (
            visible.map((item) => (
              <button
                key={item.dealerId}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="block w-full border-b border-gray-100 px-3 py-2 text-left text-xs last:border-0 hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-800">
                  {item.headCode} — {item.dealerName}
                </span>

                <span className="mt-0.5 block text-[11px] text-gray-500">
                  Outstanding {money(item.outstanding)}
                  {item.creditBalance > 0
                    ? ` · Credit ${money(item.creditBalance)}`
                    : ""}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
