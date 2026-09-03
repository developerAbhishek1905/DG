import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

import type {
  CityMaster,
} from "../types/city.types";

interface Props {
  cities: CityMaster[];

  loading?: boolean;

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  onPageChange: (
    page: number
  ) => void;

  onLimitChange: (
    limit: number
  ) => void;

  onEdit: (
    city: CityMaster
  ) => void;

  onDelete: (
    city: CityMaster
  ) => void;
}

export default function CityTable({
  cities,
  loading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: Props) {
  const startRecord =
    total === 0
      ? 0
      : (page - 1) *
          limit +
        1;

  const endRecord =
    Math.min(
      page * limit,
      total
    );

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading cities...
      </div>
    );
  }

  if (!cities.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No cities found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={thClass}>
                City ID
              </th>

              <th className={thClass}>
                City Name
              </th>

              <th className={thClass}>
                District
              </th>

              <th className={thClass}>
                State
              </th>

              <th
                className={`${thClass} text-right`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {cities.map(
              (
                city
              ) => (
                <tr
                  key={
                    city._id
                  }
                  className="transition hover:bg-gray-50"
                >
                  <td className={tdClass}>
                    {
                      city.city_id
                    }
                  </td>

                  <td className={`${tdClass} font-medium text-gray-900`}>
                    {
                      city.city_name
                    }
                  </td>

                  <td className={tdClass}>
                    {city.district_name ??
                      city.district_id}
                  </td>

                  <td className={tdClass}>
                    {city.state_name ??
                      city.state_id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit City"
                        onClick={() =>
                          onEdit(
                            city
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        title="Delete City"
                        onClick={() =>
                          onDelete(
                            city
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {
                startRecord
              }
            </span>
            {" - "}
            <span className="font-medium text-gray-700">
              {
                endRecord
              }
            </span>
            {" of "}
            <span className="font-medium text-gray-700">
              {total}
            </span>
          </p>

          <select
            value={
              limit
            }
            onChange={(
              event
            ) =>
              onLimitChange(
                Number(
                  event
                    .target
                    .value
                )
              )
            }
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={
              page <= 1
            }
            onClick={() =>
              onPageChange(
                page - 1
              )
            }
            className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft
              size={17}
            />
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            type="button"
            disabled={
              page >=
              totalPages
            }
            onClick={() =>
              onPageChange(
                page + 1
              )
            }
            className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight
              size={17}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

const thClass =
  "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500";

const tdClass =
  "whitespace-nowrap px-5 py-4 text-sm text-gray-700";