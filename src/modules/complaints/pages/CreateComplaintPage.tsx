// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import ComplaintForm from "../components/ComplaintForm";

// export default function CreateComplaintPage() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <button
//         onClick={() => navigate("/complaints")}
//         className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
//       >
//         <ArrowLeft size={17} />
//         Back to Complaints
//       </button>

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Create Complaint
//         </h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Register a new customer complaint.
//         </p>
//       </div>

//       <ComplaintForm />
//     </div>
//   );
// }


import {
  ArrowLeft,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import ComplaintForm from "../components/ComplaintForm";
import DealerAllocationModal, {
  type AllocationDealer,
} from "../components/DealerAllocationModal";

import type {
  Complaint,
} from "../types/complaint.types";

const mockDealers: AllocationDealer[] = [
  {
    id: "DLR-001",

    name: "ABC Electronics",

    code: "DLR-001",

    phone: "9876500000",

    city: "Indore",

    // distance: 2.4,

    activeJobs: 3,

    technicians: 5,

    rating: 4.8,

    serviceMatch: true,

    available: true,
  },

  {
    id: "DLR-003",

    name: "Shree Service Center",

    code: "DLR-003",

    phone: "9826012345",

    city: "Indore",

    // distance: 4.1,

    activeJobs: 2,

    technicians: 3,

    rating: 4.5,

    serviceMatch: true,

    available: true,
  },

  {
    id: "DLR-004",

    name: "Metro Electronics",

    code: "DLR-004",

    phone: "9993011223",

    city: "Indore",

    // distance: 5.7,

    activeJobs: 7,

    technicians: 4,

    rating: 4.7,

    serviceMatch: true,

    available: true,
  },

  {
    id: "DLR-005",

    name: "Central Appliance Care",

    code: "DLR-005",

    phone: "9755512345",

    city: "Indore",

    // distance: 7.3,

    activeJobs: 4,

    technicians: 2,

    rating: 4.1,

    serviceMatch: false,

    available: false,
  },
];

export default function CreateComplaintPage() {
  const navigate =
    useNavigate();

  const [
    createdComplaint,
    setCreatedComplaint,
  ] =
    useState<Complaint | null>(
      null
    );

  const [
    allocationOpen,
    setAllocationOpen,
  ] = useState(false);

  const [
    selectedDealerId,
    setSelectedDealerId,
  ] =
    useState<string>("");

  const [
    allocationLoading,
    setAllocationLoading,
  ] = useState(false);

  /*
   * Called after complaint
   * creation succeeds.
   */
  const handleComplaintCreated = (
    complaint: Complaint
  ) => {
    setCreatedComplaint(
      complaint
    );

    /*
     * Automatically select
     * recommended dealer.
     */
    const recommendedDealer =
      mockDealers.find(
        (dealer) =>
          dealer.available &&
          dealer.serviceMatch
      );

    setSelectedDealerId(
      recommendedDealer?.id ||
        ""
    );

    /*
     * Open allocation popup.
     */
    setAllocationOpen(true);
  };

  /*
   * Allocate dealer
   */
  const handleAllocateDealer =
    async () => {
      if (
        !createdComplaint ||
        !selectedDealerId
      ) {
        return;
      }

      try {
        setAllocationLoading(
          true
        );

        /*
         * MOCK allocation API
         *
         * Later:
         *
         * await allocateDealer({
         *   complaintId:
         *     createdComplaint.id,
         *   dealerId:
         *     selectedDealerId,
         * });
         */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              700
            )
        );

        console.log(
          "Dealer allocation:",
          {
            complaintId:
              createdComplaint.id,

            dealerId:
              selectedDealerId,
          }
        );

        setAllocationOpen(
          false
        );

        /*
         * Later we can navigate to
         * allocation details instead.
         */
        navigate(
          `/complaints/${createdComplaint.id}`
        );
      } finally {
        setAllocationLoading(
          false
        );
      }
    };

  /*
   * User wants to allocate
   * dealer later.
   */
  const handleAllocateLater =
    () => {
      setAllocationOpen(false);

      if (
        createdComplaint
      ) {
        navigate(
          `/complaints/${createdComplaint.id}`
        );
      } else {
        navigate(
          "/complaints"
        );
      }
    };

  return (
    <div>
      {/* ===========================
          BACK
      ============================ */}

      <button
        onClick={() =>
          navigate(
            "/complaints"
          )
        }
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft
          size={17}
        />

        Back to Complaints
      </button>

      {/* ===========================
          HEADER
      ============================ */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Complaint
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Register a new
          customer complaint.
        </p>
      </div>

      {/* ===========================
          FORM
      ============================ */}

      <ComplaintForm
        onComplaintCreated={
          handleComplaintCreated
        }
      />

      {/* ===========================
          DEALER ALLOCATION MODAL
      ============================ */}

      <DealerAllocationModal
        open={
          allocationOpen
        }
        complaintNumber={
          createdComplaint
            ?.complaintNumber
        }
        dealers={
          mockDealers
        }
        selectedDealerId={
          selectedDealerId
        }
        onSelectDealer={
          setSelectedDealerId
        }
        onAllocate={
          handleAllocateDealer
        }
        onSkip={
          handleAllocateLater
        }
        loading={
          allocationLoading
        }
      />
    </div>
  );
}