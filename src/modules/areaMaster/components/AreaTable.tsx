import {
  Edit3,
  MapPin,
  Power,
} from "lucide-react";

import type {
  Area,
} from "../types/area.types";

import AreaStatusBadge from "./AreaStatusBadge";

interface Props {
  areas: Area[];

  loading?: boolean;

  onEdit: (
    area: Area
  ) => void;

  onToggleStatus: (
    area: Area
  ) => void;
}

export default function AreaTable({
  areas,
  loading,
  onEdit,
  onToggleStatus,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
        Loading areas...
      </div>
    );
  }

  if (
    areas.length === 0
  ) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
        <MapPin
          size={32}
          className="mx-auto mb-3 text-gray-300"
        />

        <p className="text-sm font-medium text-gray-700">
          No areas found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">
                Area Code
              </th>

              <th className="px-5 py-3">
                Area Name
              </th>

              <th className="px-5 py-3">
                City
              </th>

              <th className="px-5 py-3">
                District
              </th>

              <th className="px-5 py-3">
                State
              </th>

              <th className="px-5 py-3">
                Pincode
              </th>

              <th className="px-5 py-3">
                Zone
              </th>

              <th className="px-5 py-3">
                Status
              </th>

              <th className="px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {areas.map(
              (area) => (
                <tr
                  key={
                    area.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-[#123B7A]">
                    {
                      area.areaCode
                    }
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    {
                      area.areaName
                    }
                  </td>

                  <td className="px-5 py-4">
                    {
                      area.city
                    }
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {area.district ||
                      "-"}
                  </td>

                  <td className="px-5 py-4">
                    {
                      area.state
                    }
                  </td>

                  <td className="px-5 py-4">
                    {area.pincode ||
                      "-"}
                  </td>

                  <td className="px-5 py-4">
                    {area.zone ||
                      "-"}
                  </td>

                  <td className="px-5 py-4">
                    <AreaStatusBadge
                      status={
                        area.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit Area"
                        onClick={() =>
                          onEdit(
                            area
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-[#123B7A]"
                      >
                        <Edit3
                          size={
                            17
                          }
                        />
                      </button>

                      <button
                        type="button"
                        title={
                          area.status ===
                          "ACTIVE"
                            ? "Deactivate"
                            : "Activate"
                        }
                        onClick={() =>
                          onToggleStatus(
                            area
                          )
                        }
                        className={`rounded-lg p-2 ${
                          area.status ===
                          "ACTIVE"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        <Power
                          size={
                            17
                          }
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
    </div>
  );
}