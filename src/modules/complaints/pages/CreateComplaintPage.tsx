
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import ComplaintForm from "../components/ComplaintForm";
// import type { Complaint } from "../types/complaint.types";

// export default function CreateComplaintPage() {
//   const navigate = useNavigate();

//   /*
//    * Called after complaint creation succeeds
//    */
//   const handleComplaintCreated = (_complaint: Complaint) => {
//     navigate("/complaints");
//   };

//   return (
//     <div>
//       {/* ===========================
//           BACK
//       ============================ */}

//       <button
//         onClick={() => navigate("/complaints")}
//         className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
//       >
//         <ArrowLeft size={17} />
//         Back to Complaints
//       </button>

//       {/* ===========================
//           HEADER
//       ============================ */}

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Create Complaint</h1>
//       </div>

//       {/* ===========================
//           FORM
//       ============================ */}

//       <ComplaintForm onComplaintCreated={handleComplaintCreated} />
//     </div>
//   );
// }


import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm";

export default function CreateComplaintPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/complaints")}
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Complaints
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Complaint
        </h1>
      </div>

      <ComplaintForm />
    </div>
  );
}