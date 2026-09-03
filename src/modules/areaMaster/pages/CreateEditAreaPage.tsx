// import { ArrowLeft } from "lucide-react";

// import { useEffect } from "react";

// import { useNavigate, useParams } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import AreaForm from "../components/AreaForm";

// import {
//   clearSelectedArea,
//   createAreaAction,
//   fetchAreaById,
//   updateAreaAction,
// } from "../store/areaSlice";

// import type { AreaFormData } from "../types/area.types";

// export default function CreateEditAreaPage() {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const dispatch = useAppDispatch();

//   const { selectedArea, loading, actionLoading, error } = useAppSelector(
//     (state) => state.area,
//   );

//   const isEdit = Boolean(id);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAreaById(id));
//     } else {
//       dispatch(clearSelectedArea());
//     }

//     return () => {
//       dispatch(clearSelectedArea());
//     };
//   }, [id, dispatch]);

//   const handleSubmit = async (data: AreaFormData) => {
//     try {
//       if (isEdit && id) {
//         await dispatch(
//           updateAreaAction({
//             id,
//             data,
//           }),
//         ).unwrap();
//       } else {
//         await dispatch(createAreaAction(data)).unwrap();
//       }

//       navigate("/area-master");
//     } catch {
//       // error available
//       // from redux state
//     }
//   };

//   if (isEdit && loading) {
//     return (
//       <div className="py-10 text-center text-sm text-gray-500">
//         Loading area...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => navigate("/area-master")}
//         className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
//       >
//         <ArrowLeft size={17} />
//         Back to Area Master
//       </button>

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {isEdit ? "Edit Area" : "Create Area"}
//         </h1>

//         <p className="mt-1 text-sm text-gray-500">
//           {isEdit
//             ? "Update area master information."
//             : "Create a new service area."}
//         </p>
//       </div>

//       {error && (
//         <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <AreaForm
//         area={selectedArea}
//         loading={actionLoading}
//         onSubmit={handleSubmit}
//         onCancel={() => navigate("/area-master")}
//       />
//     </div>
//   );
// }

import { ArrowLeft } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import AreaForm from "../components/AreaForm";

import { createArea, getAreaById, updateArea } from "../services/areaApi";

import type { Area, AreaFormData } from "../types/area.types";

export default function CreateEditAreaPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const isEdit = Boolean(id);

  /* =================================
     FETCH SINGLE AREA
  ================================= */

  useEffect(() => {
    const fetchArea = async () => {
      if (!id) {
        setSelectedArea(null);

        return;
      }

      try {
        setLoading(true);

        const area = await getAreaById(id);

        setSelectedArea(area);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch area");
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, [id]);

  /* =================================
     CREATE / UPDATE
  ================================= */

  const handleSubmit = async (data: AreaFormData) => {
    try {
      setActionLoading(true);

      if (isEdit && id) {
        await updateArea(id, data);

        toast.success("Area updated successfully");
      } else {
        await createArea(data);

        toast.success("Area created successfully");
      }

      navigate("/area-master");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save area");
    } finally {
      setActionLoading(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Loading area...
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/area-master")}
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Area Master
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Area" : "Create Area"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update area master information."
            : "Create a new service area."}
        </p>
      </div>

      <AreaForm
        area={selectedArea}
        loading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/area-master")}
      />
    </div>
  );
}
