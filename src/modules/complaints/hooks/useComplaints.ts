import { useEffect, useState } from "react";

import type { Complaint } from "../types/complaint.types";

import { getComplaints } from "../services/complaintApi";

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  return {
    complaints,
    loading,
  };
}