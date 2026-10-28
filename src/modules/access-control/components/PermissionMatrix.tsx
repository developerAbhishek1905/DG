import { useMemo, useState } from "react";
import { Check, ChevronDown, Minus, Search } from "lucide-react";

import type { Permission } from "../types/accessControl.types";

interface Props {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

/** Sections follow the sidebar. Modules not listed fall into "Other". */
const SECTIONS: { title: string; modules: string[] }[] = [
  {
    title: "Complaints & Operations",
    modules: [
      "Complaints",
      "Appointments",
      "DG Verification",
      "Pending",
      "Cancellations",
      "Closures",
      "Allocation",
    ],
  },
  { title: "Dealers Management", modules: ["Dealers", "Dealer Activity"] },
  { title: "Account Management", modules: ["Billing", "Dealer Ledger"] },
  {
    title: "Product Management",
    modules: [
      "Product Master",
      "Category",
      "Brand",
      "Product Type",
      "Product",
      "Closure Master",
    ],
  },
  {
    title: "Address Master",
    modules: ["Address", "State", "District", "City", "Pincode", "Area"],
  },
  { title: "Reason Master", modules: ["Reason"] },
  { title: "Administration", modules: ["Users", "Roles", "Roles & Permissions"] },
];

const ACTION_ORDER = [
  "access",
  "table",
  "view",
  "create",
  "update",
  "delete",
];

const sortPermissions = (a: Permission, b: Permission) => {
  const ia = ACTION_ORDER.indexOf(a.action);
  const ib = ACTION_ORDER.indexOf(b.action);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
};

function Box({
  state,
  disabled,
  onClick,
  title,
}: {
  state: "all" | "some" | "none";
  disabled?: boolean;
  onClick: () => void;
  title?: string;
}) {
  const on = state !== "none";

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
        on
          ? "border-[#123B7A] bg-[#123B7A] text-white"
          : "border-gray-300 bg-white hover:border-[#123B7A]"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      {state === "all" && <Check size={13} strokeWidth={3} />}
      {state === "some" && <Minus size={13} strokeWidth={3} />}
    </button>
  );
}

export default function PermissionMatrix({
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const selected = useMemo(
    () => new Set(selectedPermissions),
    [selectedPermissions],
  );

  const byModule = useMemo(() => {
    const map = new Map<string, Permission[]>();
    permissions.forEach((p) => {
      if (!map.has(p.module)) map.set(p.module, []);
      map.get(p.module)!.push(p);
    });
    map.forEach((list) => list.sort(sortPermissions));
    return map;
  }, [permissions]);

  const sections = useMemo(() => {
    const used = new Set<string>();

    const result = SECTIONS.map((section) => {
      const modules = section.modules.filter((m) => byModule.has(m));
      modules.forEach((m) => used.add(m));
      return { title: section.title, modules };
    });

    const other = Array.from(byModule.keys()).filter((m) => !used.has(m));
    if (other.length) result.push({ title: "Other", modules: other });

    return result.filter((s) => s.modules.length > 0);
  }, [byModule]);

  const q = query.trim().toLowerCase();

  const matches = (module: string, p: Permission) =>
    !q ||
    module.toLowerCase().includes(q) ||
    p.label.toLowerCase().includes(q) ||
    p.action.toLowerCase().includes(q);

  const setKeys = (keys: string[], on: boolean) => {
    if (disabled) return;
    onChange(
      on
        ? Array.from(new Set([...selectedPermissions, ...keys]))
        : selectedPermissions.filter((k) => !keys.includes(k)),
    );
  };

  const stateOf = (keys: string[]): "all" | "some" | "none" => {
    const n = keys.filter((k) => selected.has(k)).length;
    if (n === 0) return "none";
    return n === keys.length ? "all" : "some";
  };

  const total = permissions.length;
  const totalSelected = permissions.filter((p) => selected.has(p.key)).length;

  return (
    <div className="space-y-5">
      {/* TOP BAR */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search module or permission..."
            className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#123B7A]">
            {totalSelected} of {total} selected
          </span>

          {!disabled && (
            <>
              <button
                type="button"
                onClick={() => setKeys(permissions.map((p) => p.key), true)}
                className="text-xs font-medium text-[#123B7A] hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setKeys(permissions.map((p) => p.key), false)}
                className="text-xs font-medium text-gray-500 hover:underline"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* SECTIONS */}
      {sections.map((section) => {
        const visibleModules = section.modules.filter((m) =>
          (byModule.get(m) ?? []).some((p) => matches(m, p)),
        );

        if (visibleModules.length === 0) return null;

        const sectionKeys = section.modules.flatMap((m) =>
          (byModule.get(m) ?? []).map((p) => p.key),
        );

        return (
          <section key={section.title}>
            <div className="mb-3 flex items-center gap-3">
              <Box
                state={stateOf(sectionKeys)}
                disabled={disabled}
                title={`Select all in ${section.title}`}
                onClick={() =>
                  setKeys(sectionKeys, stateOf(sectionKeys) !== "all")
                }
              />
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                {section.title}
              </h3>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleModules.map((module) => {
                const list = byModule.get(module) ?? [];
                const keys = list.map((p) => p.key);
                const state = stateOf(keys);
                const count = keys.filter((k) => selected.has(k)).length;
                const isCollapsed = collapsed[module] && !q;

                return (
                  <div
                    key={module}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <Box
                        state={state}
                        disabled={disabled}
                        title={`Select all ${module} permissions`}
                        onClick={() => setKeys(keys, state !== "all")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setCollapsed((c) => ({ ...c, [module]: !c[module] }))
                        }
                        className="flex flex-1 items-center justify-between text-left"
                      >
                        <span className="text-sm font-semibold text-gray-900">
                          {module}
                        </span>

                        <span className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              count === 0
                                ? "bg-gray-100 text-gray-500"
                                : "bg-blue-100 text-[#123B7A]"
                            }`}
                          >
                            {count}/{keys.length}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${
                              isCollapsed ? "" : "rotate-180"
                            }`}
                          />
                        </span>
                      </button>
                    </div>

                    {!isCollapsed && (
                      <ul className="divide-y divide-gray-50 px-4 py-1">
                        {list
                          .filter((p) => matches(module, p))
                          .map((p) => {
                            const checked = selected.has(p.key);

                            return (
                              <li key={p.key}>
                                <label
                                  className={`flex items-center gap-3 py-2.5 ${
                                    disabled
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  <Box
                                    state={checked ? "all" : "none"}
                                    disabled={disabled}
                                    onClick={() => setKeys([p.key], !checked)}
                                  />
                                  <span
                                    className={`text-sm ${
                                      checked
                                        ? "font-medium text-gray-900"
                                        : "text-gray-600"
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setKeys([p.key], !checked);
                                    }}
                                  >
                                    {p.label}
                                  </span>
                                </label>
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {sections.every(
        (s) =>
          !s.modules.some((m) =>
            (byModule.get(m) ?? []).some((p) => matches(m, p)),
          ),
      ) && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No permissions match your search.
        </div>
      )}
    </div>
  );
}
