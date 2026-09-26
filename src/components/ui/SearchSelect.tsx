import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  required?: boolean;

  filterMode?: "local" | "server";

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
  required = false,

  filterMode = "local",

  onSearch,
  onSelect,
  onClear,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent browser from recognizing this as city/address/state etc.
  // Stable for the lifetime of this component.
  const browserSafeInputName = useRef(
    `search_lookup_${crypto.randomUUID()}`,
  ).current;

useEffect(() => {
  setSearch(value || "");
  setQuery("");
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

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

//   const filteredOptions = options.filter((option) =>
//   option.label.toLowerCase().includes(search.trim().toLowerCase()),
// );

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value;

//     setSearch(newValue);
//     setOpen(true);

//     onSearch?.(newValue);
//   };
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = event.target.value;

  setSearch(newValue);
  setQuery(newValue);
  setOpen(true);

  onSearch?.(newValue);
};

//   const handleSelect = (option: SearchSelectOption) => {
//     setSearch(option.label);
//     setOpen(false);

//     onSelect(option);
//   };

const handleSelect = (option: SearchSelectOption) => {
  setSearch(option.label);
  setQuery("");
  setOpen(false);

  onSelect(option);
};

//   const handleClear = () => {
//     setSearch("");

//     onSearch?.("");
//     onClear?.();

//     setOpen(true);
//   };

const handleClear = () => {
  setSearch("");
  setQuery("");

  onSearch?.("");
  onClear?.();

  setOpen(true);
};

const filteredOptions =
  filterMode === "server"
    ? options
    : query.trim()
      ? options.filter((option) =>
          option.label
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
      : options;
  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label
        htmlFor={browserSafeInputName}
        className="mb-0.5 block text-[11px] font-medium leading-4 text-[#123B7A]"
      >
        {label}
         {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        <Search
          size={13}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            left-2.5
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          id={browserSafeInputName}
          name={browserSafeInputName}
          // Important for Chrome autofill
          type="search"
          required={required}
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={search}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleSearch}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
          className={`
            h-8 w-full rounded-md border bg-white
            pl-7 pr-14 text-xs text-gray-700
            outline-none transition
            placeholder:text-gray-400

            ${
              error
                ? `
                  border-red-400
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-100
                `
                : `
                  border-gray-300
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-100
                `
            }

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
          `}
        />

        {/* Right icons */}
        <div
          className="
            absolute
            right-1.5
            top-1/2
            flex
            -translate-y-1/2
            items-center
            gap-0.5
          "
        >
          {loading && (
            <Loader2 size={13} className="animate-spin text-gray-400" />
          )}

          {!loading && search && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-red-500
              "
              title="Clear"
            >
              <X size={12} />
            </button>
          )}

          <ChevronDown
            size={13}
            className={`
              text-gray-400
              transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="
            absolute
            z-50
            mt-1
            max-h-44
            w-full
            overflow-y-auto
            rounded-md
            border
            border-gray-200
            bg-white
            py-0.5
            shadow-lg
          "
        >
          {loading ? (
            <div
              className="
                flex
                items-center
                gap-2
                px-2.5
                py-2
                text-xs
                text-gray-500
              "
            >
              <Loader2 size={13} className="animate-spin" />
              Loading...
            </div>
) : filteredOptions.length > 0 ? (
  filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="
                  block
                  w-full
                  truncate
                  px-2.5
                  py-1.5
                  text-left
                  text-xs
                  text-gray-700
                  transition
                  hover:bg-blue-50
                  hover:text-blue-700
                "
                title={option.label}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-2.5 py-2 text-xs text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-0.5 text-[10px] leading-3 text-red-600">{error}</p>
      )}
    </div>
  );
}
