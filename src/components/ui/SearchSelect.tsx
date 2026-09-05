import {
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export interface SearchSelectOption {
  value: string | number;
  label: string;
  data?: unknown;
}

interface SearchSelectProps {
  label: string;

  value?: string;

  placeholder?: string;

  options: SearchSelectOption[];

  loading?: boolean;

  disabled?: boolean;

  error?: string;

  onSearch?: (search: string) => void;

  onSelect: (option: SearchSelectOption) => void;

  onClear?: () => void;
}

export default function SearchSelect({
  label,
  value = "",
  placeholder = "Search and select",
  options,
  loading = false,
  disabled = false,
  error,
  onSearch,
  onSelect,
  onClear,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState(value);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    setSearch(newValue);

    setOpen(true);

    onSearch?.(newValue);
  };

  const handleSelect = (
    option: SearchSelectOption,
  ) => {
    setSearch(option.label);

    setOpen(false);

    onSelect(option);
  };

  const handleClear = () => {
    setSearch("");

    onSearch?.("");

    onClear?.();

    setOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleSearch}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading && (
            <Loader2
              size={16}
              className="animate-spin text-gray-400"
            />
          )}

          {!loading && search && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          )}

          <ChevronDown
            size={16}
            className="text-gray-400"
          />
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Loading...
            </div>
          ) : options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleSelect(option)
                }
                className="block w-full border-b border-gray-50 px-4 py-2.5 text-left text-sm text-gray-700 last:border-b-0 hover:bg-blue-50"
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}