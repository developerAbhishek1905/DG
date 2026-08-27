import {
  ArrowLeft,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import ItemForm from "../components/ItemForm";

import {
  clearSelectedItem,
  createItemAction,
  fetchItemById,
  updateItemAction,
} from "../store/itemSlice";

// import {
//   fetchCategories,
// } from "./modules/categoryMaster/store/categorySlice";

import {
  fetchCategories,
} from "../../categoryMaster/store/categorySlice";

import type {
  ItemFormData,
} from "../types/item.types";

export default function CreateEditItemPage() {
  const {
    id,
  } = useParams();

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    selectedItem,
    actionLoading,
  } =
    useAppSelector(
      (
        state
      ) => state.item
    );

  const isEdit =
    Boolean(id);

  useEffect(() => {
    dispatch(
      fetchCategories()
    );

    if (id) {
      dispatch(
        fetchItemById(
          id
        )
      );
    } else {
      dispatch(
        clearSelectedItem()
      );
    }
  }, [
    id,
    dispatch,
  ]);

  const handleSubmit =
    async (
      data: ItemFormData
    ) => {
      if (
        isEdit &&
        id
      ) {
        await dispatch(
          updateItemAction(
            {
              id,
              data,
            }
          )
        ).unwrap();
      } else {
        await dispatch(
          createItemAction(
            data
          )
        ).unwrap();
      }

      navigate(
        "/item-master"
      );
    };

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            "/item-master"
          )
        }
        className="mb-5 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft
          size={17}
        />

        Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">
        {isEdit
          ? "Edit Item"
          : "Create Item"}
      </h1>

      <ItemForm
        item={
          selectedItem
        }
        loading={
          actionLoading
        }
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate(
            "/item-master"
          )
        }
      />
    </div>
  );
}