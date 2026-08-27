import {
  Activity,
  Clock3,
  Globe2,
  Monitor,
  User,
  X,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearSelectedAuditLog,
} from "../store/auditLogSlice";

function displayValue(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Empty";
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value
      ? "True"
      : "False";
  }

  return String(value);
}

export default function AuditLogDetails() {
  const dispatch =
    useAppDispatch();

  const selectedLog =
    useAppSelector(
      (state) =>
        state.auditLogs
          .selectedLog
    );

  if (!selectedLog) {
    return null;
  }

  const date =
    new Date(
      selectedLog.createdAt
    );

  return (
    <>
      {/* OVERLAY */}

      <div
        onClick={() =>
          dispatch(
            clearSelectedAuditLog()
          )
        }
        className="fixed inset-0 z-40 bg-black/30"
      />

      {/* DRAWER */}

      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#123B7A]">
              Audit Record
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {selectedLog.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              dispatch(
                clearSelectedAuditLog()
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          {/* DESCRIPTION */}

          <section>
            <h3 className="text-sm font-semibold text-gray-900">
              Activity
            </h3>

            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-3">
                <Activity
                  size={19}
                  className="mt-0.5 text-[#123B7A]"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {selectedLog.action}
                    </span>

                    <span className="text-xs text-gray-500">
                      {selectedLog.module.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {selectedLog.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* USER */}

          <section>
            <h3 className="text-sm font-semibold text-gray-900">
              Performed By
            </h3>

            <div className="mt-3 rounded-xl border border-gray-200 p-4">
              <InfoRow
                icon={<User size={17} />}
                label="User"
                value={
                  selectedLog.user.name
                }
              />

              <InfoRow
                label="Email"
                value={
                  selectedLog.user.email
                }
              />

              <InfoRow
                label="Role"
                value={
                  selectedLog.user.role
                }
              />
            </div>
          </section>

          {/* REQUEST */}

          <section>
            <h3 className="text-sm font-semibold text-gray-900">
              Request Information
            </h3>

            <div className="mt-3 rounded-xl border border-gray-200 p-4">
              <InfoRow
                icon={
                  <Clock3 size={17} />
                }
                label="Date & Time"
                value={date.toLocaleString(
                  "en-IN"
                )}
              />

              <InfoRow
                icon={
                  <Globe2 size={17} />
                }
                label="IP Address"
                value={
                  selectedLog.ipAddress ??
                  "Unknown"
                }
              />

              <InfoRow
                icon={
                  <Monitor size={17} />
                }
                label="Device"
                value={
                  selectedLog.userAgent ??
                  "Unknown"
                }
              />
            </div>
          </section>

          {/* ENTITY */}

          {selectedLog.entityId && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900">
                Related Resource
              </h3>

              <div className="mt-3 rounded-xl border border-gray-200 p-4">
                <InfoRow
                  label="Entity ID"
                  value={
                    selectedLog.entityId
                  }
                />

                <InfoRow
                  label="Entity Type"
                  value={
                    selectedLog.entityType ??
                    "Unknown"
                  }
                />
              </div>
            </section>
          )}

          {/* CHANGES */}

          {selectedLog.changes &&
            selectedLog.changes.length >
              0 && (
              <section>
                <h3 className="text-sm font-semibold text-gray-900">
                  Changes
                </h3>

                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                  {selectedLog.changes.map(
                    (
                      change,
                      index
                    ) => (
                      <div
                        key={`${change.field}-${index}`}
                        className="border-b border-gray-100 p-4 last:border-b-0"
                      >
                        <p className="text-sm font-semibold text-gray-900">
                          {
                            change.field
                          }
                        </p>

                        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                          <div className="rounded-lg bg-red-50 p-3">
                            <p className="text-[10px] font-semibold uppercase text-red-500">
                              Before
                            </p>

                            <p className="mt-1 break-all text-sm text-red-700">
                              {displayValue(
                                change.oldValue
                              )}
                            </p>
                          </div>

                          <span className="text-gray-400">
                            →
                          </span>

                          <div className="rounded-lg bg-green-50 p-3">
                            <p className="text-[10px] font-semibold uppercase text-green-600">
                              After
                            </p>

                            <p className="mt-1 break-all text-sm text-green-700">
                              {displayValue(
                                change.newValue
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
        </div>
      </aside>
    </>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-gray-100 py-3 first:pt-0 last:border-b-0 last:pb-0">
      {icon && (
        <div className="mt-0.5 text-gray-400">
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}