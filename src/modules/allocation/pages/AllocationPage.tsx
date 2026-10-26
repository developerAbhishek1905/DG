import { useEffect, useMemo, useState } from "react";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { ArrowLeft, History, Play, Save, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AllocationHistoryTable from "../components/AllocationHistoryTable";
import DealerAllocationTable from "../components/DealerAllocationTable";
import {
  applyAllocationSettings,
  getAllocationCities,
  getAllocationSettings,
  saveAllocationSettings,
  type AllocationSettings,
  type ExcludedCity,
} from "../services/allocationSettingsApi";

const dateInput = (value?: string | null) => (value ? value.slice(0, 10) : "");

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

const inputClass =
  "h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

export default function AllocationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [view, setView] = useState<"table" | "settings" | "history">("table");

  const [cities, setCities] = useState<ExcludedCity[]>([]);
  const [saved, setSaved] = useState<AllocationSettings | null>(null);

  const [enabled, setEnabled] = useState(true);
  const [useCreditLimit, setUseCreditLimit] = useState(false);
  const [excluded, setExcluded] = useState<ExcludedCity[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [monthlyEnabled, setMonthlyEnabled] = useState(false);
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [reminderOn, setReminderOn] = useState(true);
  const [reminderMin, setReminderMin] = useState(30);
  const [penaltyOn, setPenaltyOn] = useState(true);
  const [penaltyAfter, setPenaltyAfter] = useState(30);

  useEffect(() => {
    Promise.all([getAllocationSettings(), getAllocationCities()])
      .then(([settings, cityList]) => {
        setSaved(settings);
        setCities(cityList);
        setEnabled(settings.autoAllocationEnabled);
        setUseCreditLimit(settings.useCreditLimit);
        setExcluded(settings.excludedCities);
        setFrom(dateInput(settings.rangeFrom));
        setTo(dateInput(settings.rangeTo));
        setMonthlyEnabled(settings.monthlyRecalcEnabled);
        setMonthlyDay(settings.monthlyRecalcDay || 1);
        setReminderOn(settings.noActionReminderEnabled ?? true);
        setReminderMin(settings.noActionReminderMinutes ?? 30);
        setPenaltyOn(settings.noActionPenaltyEnabled ?? true);
        setPenaltyAfter(settings.noActionPenaltyAfterMinutes ?? 30);
      })
      .catch(() => toast.error("Failed to load allocation settings"))
      .finally(() => setLoading(false));
  }, []);

  const excludedIds = useMemo(
    () => new Set(excluded.map((item) => item.cityId)),
    [excluded],
  );

  const cityChoices = useMemo(() => {
    const query = citySearch.trim().toLowerCase();

    return cities.filter(
      (item) =>
        !excludedIds.has(item.cityId) &&
        (!query || item.cityName.toLowerCase().includes(query)),
    );
  }, [cities, excludedIds, citySearch]);

  const rangeValid = Boolean(from && to && from <= to);

  const payload = () => ({
    autoAllocationEnabled: enabled,
    excludedCities: excluded,
    useCreditLimit,
    rangeFrom: from,
    rangeTo: to,
    monthlyRecalcEnabled: monthlyEnabled,
    monthlyRecalcDay: monthlyDay,
    noActionReminderEnabled: reminderOn,
    noActionReminderMinutes: reminderMin,
    noActionPenaltyEnabled: penaltyOn,
    noActionPenaltyAfterMinutes: penaltyAfter,
  });

  const handleSave = async () => {
    if (from && to && from > to) {
      toast.error("From date cannot be after To date");
      return;
    }

    try {
      setSaving(true);
      setSaved(await saveAllocationSettings(payload()));
      setTableRefresh((value) => value + 1);
      toast.success("Allocation settings saved");
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save settings"));
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (!rangeValid) {
      toast.error("Select a valid date range first");
      return;
    }

    try {
      setApplying(true);

      // Always apply exactly what is on screen
      setSaved(await saveAllocationSettings(payload()));

      const result = await applyAllocationSettings({
        rangeFrom: from,
        rangeTo: to,
      });

      setSaved(await getAllocationSettings());
      setTableRefresh((value) => value + 1);
      toast.success(result.message);
    } catch (error) {
      toast.error(errorMessage(error, "Failed to apply settings"));
    } finally {
      setApplying(false);
    }
  };

  const summary = saved?.lastAppliedSummary;

  return (
    <div>
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => {
                // Inside Settings / History -> back to the allocation table,
                // from the table itself -> back to the previous page.
                if (view !== "table") {
                  setView("table");
                } else if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/complaints");
                }
              }}
              className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#123B7A]"
            >
              <ArrowLeft size={17} />
              {view !== "table" ? "Back to Dealer Allocation" : "Back"}
            </button>

            <h1 className="text-2xl font-bold text-gray-900">Dealer Allocation</h1>

            <p className="mt-1 text-sm text-gray-500">
              Dealer performance, allocation settings and allocation history.
            </p>
          </div>

          <div className="flex gap-3">
            {(
              [
                ["settings", "Settings", Settings],
                ["history", "Allocation History", History],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView((current) => (current === key ? "table" : key))}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  view === key
                    ? "border-[#123B7A] bg-[#123B7A] text-white"
                    : "border-[#123B7A] bg-white text-[#123B7A] hover:bg-blue-50"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === "history" && <AllocationHistoryTable />}

        {view === "settings" && (loading ? (
          <TableSkeleton />
        ) : (
          <div className="space-y-5">
            {/* Date range + on/off */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    From
                  </label>
                  <input
                    type="date"
                    value={from}
                    max={to || undefined}
                    onChange={(e) => setFrom(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    To
                  </label>
                  <input
                    type="date"
                    value={to}
                    min={from || undefined}
                    onChange={(e) => setTo(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Auto allocation
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => setEnabled((value) => !value)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      enabled ? "bg-[#123B7A]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                        enabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>

                  <span
                    className={`w-8 text-sm font-semibold ${
                      enabled ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {enabled ? "ON" : "OFF"}
                  </span>
                </div>
              </div>

              {!enabled && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  While OFF, new complaints are not allocated to a dealer
                  automatically. They must be allocated manually.
                </p>
              )}
            </div>

            {/* Excluded cities */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Exclude cities from auto allocation
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Complaints from these cities are never allocated automatically.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {excluded.length === 0 ? (
                  <span className="text-xs text-gray-400">
                    No city excluded
                  </span>
                ) : (
                  excluded.map((city) => (
                    <span
                      key={city.cityId}
                      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                    >
                      {city.cityName}
                      <button
                        type="button"
                        onClick={() =>
                          setExcluded((list) =>
                            list.filter((item) => item.cityId !== city.cityId),
                          )
                        }
                        className="rounded-full p-0.5 hover:bg-red-100"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <input
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city to exclude..."
                className={`${inputClass} mt-3 w-full max-w-sm`}
              />

              <div className="mt-2 max-h-44 max-w-sm overflow-y-auto rounded-lg border border-gray-200">
                {cityChoices.length === 0 ? (
                  <p className="p-3 text-xs text-gray-500">
                    {cities.length === 0
                      ? "No cities with allocation rules yet."
                      : "No matching cities."}
                  </p>
                ) : (
                  cityChoices.map((city) => (
                    <button
                      key={city.cityId}
                      type="button"
                      onClick={() => setExcluded((list) => [...list, city])}
                      className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-gray-50"
                    >
                      {city.cityName}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Credit limit */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={useCreditLimit}
                  onChange={(e) => setUseCreditLimit(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />

                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Allocate based on credit limit
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Dealers whose outstanding has reached the credit limit set
                    on the dealer are skipped. Dealers without a credit limit
                    are not affected.
                  </span>
                </span>
              </label>
            </div>

            {/* No-action reminder and penalty */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={reminderOn}
                  onChange={(e) => setReminderOn(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    WhatsApp reminder when dealer takes no action
                  </span>
                  <span className="block text-gray-500">
                    If the dealer has not scheduled, cancelled or marked the
                    complaint pending within this time after allocation.
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-2 pl-7 text-sm text-gray-700">
                Send reminder after
                <input
                  type="number"
                  min={1}
                  value={reminderMin}
                  onChange={(e) => setReminderMin(Number(e.target.value))}
                  className="w-20 rounded-lg border px-2 py-1"
                />
                minutes
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={penaltyOn}
                  onChange={(e) => setPenaltyOn(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Auto-bill a penalty if still no action
                  </span>
                  <span className="block text-gray-500">
                    A penalty bill is added to the dealer ledger. Only
                    complaints allocated after this feature started are
                    considered.
                  </span>
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2 pl-7 text-sm text-gray-700">
                Bill penalty
                <input
                  type="number"
                  min={1}
                  value={penaltyAfter}
                  onChange={(e) => setPenaltyAfter(Number(e.target.value))}
                  className="w-20 rounded-lg border px-2 py-1"
                />
                minutes after the reminder
              </div>
            </div>

            {/* Monthly automatic recalculation */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={monthlyEnabled}
                  onChange={(e) => setMonthlyEnabled(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />

                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Recalculate automatically every month
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    On the chosen date each month, dealer performance is
                    recalculated for the previous one month.
                  </span>
                </span>
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-sm text-gray-700">Run on day</label>

                <select
                  value={monthlyDay}
                  disabled={!monthlyEnabled}
                  onChange={(e) => setMonthlyDay(Number(e.target.value))}
                  className={`${inputClass} w-24 disabled:bg-gray-100`}
                >
                  {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-gray-500">of every month</span>
              </div>

              {monthlyEnabled && (
                <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900">
                  Example: on day {monthlyDay}, the run covers the{" "}
                  {monthlyDay}th of the previous month up to{" "}
                  {monthlyDay === 1
                    ? "the last day of that month"
                    : `the ${monthlyDay - 1}th of the current month`}
                  .
                </p>
              )}

              {saved?.lastScheduledRunAt && (
                <p className="mt-3 text-xs text-gray-500">
                  Last automatic run{" "}
                  {new Date(saved.lastScheduledRunAt).toLocaleString("en-IN")}
                  {saved.lastScheduledRunStatus ? ` · ${saved.lastScheduledRunStatus}` : ""}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || applying}
                className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] bg-white px-5 py-2.5 text-sm font-semibold text-[#123B7A] hover:bg-blue-50 disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Settings"}
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={saving || applying || !rangeValid}
                className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3064] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play size={16} />
                {applying ? "Applying..." : "Apply to Allocation"}
              </button>

              {!rangeValid && (
                <span className="text-xs text-gray-500">
                  Select a valid date range to apply.
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Apply saves the settings above, then recalculates every dealer's
              performance for the date range: complaints allocated, completed
              and cancelled, the amount received against their bills (credit
              notes excluded), average amount and rating. A higher rating gives
              the dealer a larger share of new complaints.
            </p>

            {summary && saved?.lastAppliedAt && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <p className="font-semibold">
                  Last applied {new Date(saved.lastAppliedAt).toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs">
                  Period {dateInput(summary.from)} to {dateInput(summary.to)} ·{" "}
                  {summary.dealersUpdated} dealer(s) updated
                  {summary.useCreditLimit
                    ? ` · ${summary.creditBlocked} at credit limit`
                    : ""}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {view === "table" && <DealerAllocationTable refreshKey={tableRefresh} />}
    </div>
  );
}
