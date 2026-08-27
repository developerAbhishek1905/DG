import { Search, Building2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { DealerLedgerSummary } from "../types/ledger.types";

interface Props {
  dealers: DealerLedgerSummary[];
}

export default function DealerLedgerSearch({
  dealers,
}: Props) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return dealers
      .filter((item) => {
        const dealer = item.dealer;

        return (
          dealer.name.toLowerCase().includes(query) ||
          dealer.dealerCode.toLowerCase().includes(query) ||
          dealer.phone?.toLowerCase().includes(query) ||
          dealer.city?.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [dealers, search]);

  const handleDealerSelect = (
    dealerId: string
  ) => {
    setSearch("");
    setFocused(false);

    navigate(`/ledger/${dealerId}`);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onFocus={() => setFocused(true)}
          placeholder="Search dealer by name, code, phone or city..."
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {focused && search.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <div className="max-h-[350px] overflow-y-auto">
              {results.map((item) => (
                <button
                  key={item.dealer.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();

                    handleDealerSelect(
                      item.dealer.id
                    );
                  }}
                  className="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {item.dealer.name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>
                          {item.dealer.dealerCode}
                        </span>

                        {item.dealer.phone && (
                          <span>
                            {item.dealer.phone}
                          </span>
                        )}

                        {item.dealer.city && (
                          <span>
                            {item.dealer.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-500">
                      Outstanding
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      ₹
                      {item.outstandingAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <Building2
                size={28}
                className="mx-auto text-gray-300"
              />

              <p className="mt-2 text-sm font-medium text-gray-700">
                No dealer found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try another dealer name, code,
                phone or city.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}