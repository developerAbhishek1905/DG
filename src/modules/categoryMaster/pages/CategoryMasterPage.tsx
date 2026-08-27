import {
  Plus,
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

import CategoryTable from "../components/CategoryTable";

import {
  fetchCategories,
  setCategoryFilters,
  toggleCategoryStatusAction,
} from "../store/categorySlice";

export default function CategoryMasterPage() {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    categories,
    loading,
    filters,
  } =
    useAppSelector(
      (
        state
      ) => state.category
    );

  useEffect(() => {
    dispatch(
      fetchCategories()
    );
  }, [dispatch]);

  const filtered =
    useMemo(() => {
      const search =
        filters.search
          .toLowerCase()
          .trim();

      return categories.filter(
        (item) => {
          const matchSearch =
            !search ||
            item.groupCategoryCode
              .toLowerCase()
              .includes(
                search
              ) ||
            item.categoryDescription
              .toLowerCase()
              .includes(
                search
              );

          const matchStatus =
            !filters.status ||
            item.status ===
              filters.status;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );
    }, [
      categories,
      filters,
    ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Category Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage group categories.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/category-master/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
        >
          <Plus
            size={17}
          />

          Add Category
        </button>
      </div>

      <div className="mb-5 flex gap-3 rounded-xl border bg-white p-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            value={
              filters.search
            }
            onChange={(e) =>
              dispatch(
                setCategoryFilters(
                  {
                    search:
                      e.target
                        .value,
                  }
                )
              )
            }
            placeholder="Search category..."
            className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          value={
            filters.status
          }
          onChange={(e) =>
            dispatch(
              setCategoryFilters(
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
          className="rounded-lg border px-3"
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
      </div>

      <CategoryTable
        categories={
          filtered
        }
        loading={
          loading
        }
        onEdit={(
          category
        ) =>
          navigate(
            `/category-master/${category.id}/edit`
          )
        }
        onToggleStatus={(
          category
        ) =>
          dispatch(
            toggleCategoryStatusAction(
              category.id
            )
          )
        }
      />
    </div>
  );
}