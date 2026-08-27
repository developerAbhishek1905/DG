import {
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import SettingsSidebar from "../components/SettingsSidebar";

import {
  createPendingReason,
  updatePendingReason,
} from "../services/settingsApi";

import {
  fetchSettings,
} from "../store/settingsSlice";

export default function PendingReasonPage() {
  const dispatch =
    useAppDispatch();

  const {
    pendingReasons,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  const [
    label,
    setLabel,
  ] =
    useState("");

  useEffect(() => {
    if (
      !pendingReasons.length
    ) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    pendingReasons.length,
  ]);

  const handleAdd =
    async () => {
      const value =
        label.trim();

      if (!value) {
        return;
      }

      await createPendingReason(
        {
          code: value
            .toUpperCase()
            .replaceAll(
              " ",
              "_"
            ),

          label: value,

          active: true,

          sortOrder:
            pendingReasons.length +
            1,
        }
      );

      setLabel("");

      dispatch(
        fetchSettings()
      );
    };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Pending Reasons
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage reasons used when complaints are placed on hold.
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex gap-3">
            <input
              value={label}
              onChange={(
                event
              ) =>
                setLabel(
                  event.target
                    .value
                )
              }
              placeholder="New pending reason..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />

            <button
              onClick={
                handleAdd
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
            >
              <Plus
                size={16}
              />

              Add
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {pendingReasons.map(
            (reason) => (
              <div
                key={
                  reason.id
                }
                className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-none"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {
                      reason.label
                    }
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {
                      reason.code
                    }
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    reason.active
                  }
                  onChange={async (
                    event
                  ) => {
                    await updatePendingReason(
                      reason.id,
                      {
                        active:
                          event
                            .target
                            .checked,
                      }
                    );

                    dispatch(
                      fetchSettings()
                    );
                  }}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}