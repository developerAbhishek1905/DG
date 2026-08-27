import {
  MapPin,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import AreaTable from "../components/AreaTable";

import {
  fetchAreas,
  resetAreaFilters,
  setAreaFilters,
  toggleAreaStatusAction,
} from "../store/areaSlice";

export default function AreaMasterPage() {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    areas,
    loading,
    filters,
  } =
    useAppSelector(
      (
        state
      ) => state.area
    );

  useEffect(() => {
    dispatch(
      fetchAreas()
    );
  }, [dispatch]);

  const cities =
    useMemo(
      () =>
        Array.from(
          new Set(
            areas.map(
              (area) =>
                area.city
            )
          )
        ).sort(),
      [areas]
    );

  const states =
    useMemo(
      () =>
        Array.from(
          new Set(
            areas.map(
              (area) =>
                area.state
            )
          )
        ).sort(),
      [areas]
    );

  const filteredAreas =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      return areas.filter(
        (area) => {
          const matchesSearch =
            !search ||
            area.areaName
              .toLowerCase()
              .includes(
                search
              ) ||
            area.areaCode
              .toLowerCase()
              .includes(
                search
              ) ||
            area.pincode
              ?.includes(
                search
              );

          const matchesCity =
            !filters.city ||
            area.city ===
              filters.city;

          const matchesState =
            !filters.state ||
            area.state ===
              filters.state;

          const matchesStatus =
            !filters.status ||
            area.status ===
              filters.status;

          return (
            matchesSearch &&
            matchesCity &&
            matchesState &&
            matchesStatus
          );
        }
      );
    }, [
      areas,
      filters,
    ]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin
              size={23}
              className="text-[#123B7A]"
            />

            <h1 className="text-2xl font-bold text-gray-900">
              Area Master
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage service
            areas used for
            complaint and dealer
            allocation.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/area-master/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854]"
        >
          <Plus
            size={17}
          />

          Add Area
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={
                filters.search
              }
              onChange={(e) =>
                dispatch(
                  setAreaFilters(
                    {
                      search:
                        e.target
                          .value,
                    }
                  )
                )
              }
              placeholder="Search area..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={
              filters.state
            }
            onChange={(e) =>
              dispatch(
                setAreaFilters(
                  {
                    state:
                      e.target
                        .value,
                  }
                )
              )
            }
            className={filterClass}
          >
            <option value="">
              All States
            </option>

            {states.map(
              (state) => (
                <option
                  key={
                    state
                  }
                  value={
                    state
                  }
                >
                  {
                    state
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              filters.city
            }
            onChange={(e) =>
              dispatch(
                setAreaFilters(
                  {
                    city:
                      e.target
                        .value,
                  }
                )
              )
            }
            className={filterClass}
          >
            <option value="">
              All Cities
            </option>

            {cities.map(
              (city) => (
                <option
                  key={
                    city
                  }
                  value={
                    city
                  }
                >
                  {
                    city
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              filters.status
            }
            onChange={(e) =>
              dispatch(
                setAreaFilters(
                  {
                    status:
                      e.target
                        .value as
                        | "ACTIVE"
                        | "INACTIVE"
                        | "",
                  }
                )
              )
            }
            className={filterClass}
          >
            <option value="">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

          <button
            type="button"
            onClick={() =>
              dispatch(
                resetAreaFilters()
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw
              size={16}
            />

            Reset
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {
              filteredAreas.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {
              areas.length
            }
          </span>{" "}
          areas
        </div>
      </div>

      <AreaTable
        areas={
          filteredAreas
        }
        loading={
          loading
        }
        onEdit={(
          area
        ) =>
          navigate(
            `/area-master/${area.id}/edit`
          )
        }
        onToggleStatus={(
          area
        ) =>
          dispatch(
            toggleAreaStatusAction(
              area.id
            )
          )
        }
      />
    </div>
  );
}

const filterClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";