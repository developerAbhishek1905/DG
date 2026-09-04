// import { ArrowLeft } from "lucide-react";

// import { useEffect } from "react";

// import { useNavigate, useParams } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import CategoryForm from "../components/CategoryForm";

// import {
//   clearSelectedCategory,
//   createCategoryAction,
//   fetchCategoryById,
//   updateCategoryAction,
// } from "../store/categorySlice";

// import type { CategoryFormData } from "../types/category.types";

// export default function CreateEditCategoryPage() {
//   const { id } = useParams();

//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   const { selectedCategory, actionLoading } = useAppSelector(
//     (state) => state.category,
//   );

//   const isEdit = Boolean(id);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchCategoryById(id));
//     } else {
//       dispatch(clearSelectedCategory());
//     }
//   }, [id, dispatch]);

//   const handleSubmit = async (data: CategoryFormData) => {
//     if (isEdit && id) {
//       await dispatch(
//         updateCategoryAction({
//           id,
//           data,
//         }),
//       ).unwrap();
//     } else {
//       await dispatch(createCategoryAction(data)).unwrap();
//     }

//     navigate("/category-master");
//   };

//   return (
//     <div>
//       <button
//         onClick={() => navigate("/category-master")}
//         className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500"
//       >
//         <ArrowLeft size={17} />
//         Back
//       </button>

//       <h1 className="mb-6 text-2xl font-bold">
//         {isEdit ? "Edit Category" : "Create Category"}
//       </h1>

//       <CategoryForm
//         category={selectedCategory}
//         loading={actionLoading}
//         onSubmit={handleSubmit}
//         onCancel={() => navigate("/category-master")}
//       />
//     </div>
//   );
// }

import { ArrowLeft } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import CategoryForm from "../components/CategoryForm";

import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../services/categoryApi";

import type { Category, CategoryFormData } from "../types/category.types";

import { toast } from "react-toastify";

export default function CreateEditCategoryPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [category, setCategory] = useState<Category | null>(null);

  const [pageLoading, setPageLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // FETCH CATEGORY FOR EDIT
  // ============================================

  useEffect(() => {
    if (!id) {
      setCategory(null);
      return;
    }

    const fetchCategory = async () => {
      try {
        setPageLoading(true);

        const data = await getCategoryById(id);

        setCategory(data);
      } catch (error) {
        console.error("Fetch category error:", error);

        toast.error("Failed to load category");

        navigate("/category-master");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  // ============================================
  // CREATE / UPDATE
  // ============================================

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setActionLoading(true);

      if (isEdit && id) {
        await updateCategory(id, data);

        toast.success("Category updated successfully");
      } else {
        await createCategory(data);

        toast.success("Category created successfully");
      }

      navigate("/category-master");
    } catch (error) {
      console.error("Save category error:", error);

      toast.error(
        isEdit ? "Failed to update category" : "Failed to create category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (isEdit && pageLoading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading category...
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/category-master")}
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Category" : "Create Category"}
      </h1>

      <CategoryForm
        category={category}
        loading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/category-master")}
      />
    </div>
  );
}
