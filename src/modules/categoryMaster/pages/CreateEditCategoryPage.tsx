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

import CategoryForm from "../components/CategoryForm";

import {
  clearSelectedCategory,
  createCategoryAction,
  fetchCategoryById,
  updateCategoryAction,
} from "../store/categorySlice";

import type {
  CategoryFormData,
} from "../types/category.types";

export default function CreateEditCategoryPage() {
  const {
    id,
  } = useParams();

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    selectedCategory,
    actionLoading,
  } =
    useAppSelector(
      (
        state
      ) => state.category
    );

  const isEdit =
    Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCategoryById(
          id
        )
      );
    } else {
      dispatch(
        clearSelectedCategory()
      );
    }
  }, [
    id,
    dispatch,
  ]);

  const handleSubmit =
    async (
      data: CategoryFormData
    ) => {
      if (
        isEdit &&
        id
      ) {
        await dispatch(
          updateCategoryAction(
            {
              id,
              data,
            }
          )
        ).unwrap();
      } else {
        await dispatch(
          createCategoryAction(
            data
          )
        ).unwrap();
      }

      navigate(
        "/category-master"
      );
    };

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            "/category-master"
          )
        }
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">
        {isEdit
          ? "Edit Category"
          : "Create Category"}
      </h1>

      <CategoryForm
        category={
          selectedCategory
        }
        loading={
          actionLoading
        }
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate(
            "/category-master"
          )
        }
      />
    </div>
  );
}