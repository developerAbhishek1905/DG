import { useEffect, useState } from "react";

import type { Complaint } from "../types/complaint.types";

import { getComplaintById } from "../services/complaintApi";

export function useComplaintDetails(id?: string) {
  const [complaint, setComplaint] =
    useState<Complaint | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadComplaint = async () => {
      try {
        const data = await getComplaintById(id);
        setComplaint(data ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  return {
    complaint,
    loading,
  };
}