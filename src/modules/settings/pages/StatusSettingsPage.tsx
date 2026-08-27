import {
  useEffect,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import SettingsSidebar from "../components/SettingsSidebar";

import {
  fetchSettings,
} from "../store/settingsSlice";

import {
  updateStatus,
} from "../services/settingsApi";

export default function StatusSettingsPage() {
  const dispatch =
    useAppDispatch();

  const {
    statuses,
    loading,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  useEffect(() => {
    if (
      !statuses.length
    ) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    statuses.length,
  ]);

  const handleToggle =
    async (
      id: string,
      active: boolean
    ) => {
      await updateStatus(
        id,
        {
          active,
        }
      );

      dispatch(
        fetchSettings()
      );
    };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Status Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage available workflow statuses.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
            Loading statuses...
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Module
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Code
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Label
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    Active
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {statuses.map(
                  (status) => (
                    <tr
                      key={
                        status.id
                      }
                    >
                      <td className="px-5 py-4 text-sm">
                        {
                          status.module
                        }
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        {
                          status.code
                        }
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {
                          status.label
                        }
                      </td>

                      <td className="px-5 py-4 text-center text-sm">
                        {
                          status.sortOrder
                        }
                      </td>

                      <td className="px-5 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={
                            status.active
                          }
                          onChange={(
                            event
                          ) =>
                            handleToggle(
                              status.id,
                              event
                                .target
                                .checked
                            )
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}