import {
  Plus,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import ItemTable from "../components/ItemTable";

import {
  fetchItems,
} from "../store/itemSlice";

export default function ItemMasterPage() {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    items,
  } =
    useAppSelector(
      (
        state
      ) => state.item
    );

  useEffect(() => {
    dispatch(
      fetchItems()
    );
  }, [dispatch]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Item Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage inventory items.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/item-master/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
        >
          <Plus
            size={17}
          />

          Add Item
        </button>
      </div>

      <ItemTable
        items={items}
        onEdit={(item) =>
          navigate(
            `/item-master/${item.id}/edit`
          )
        }
      />
    </div>
  );
}