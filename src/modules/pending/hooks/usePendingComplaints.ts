import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getPendingComplaints,
} from "../services/pendingApi";

import type {
  PendingComplaint,
} from "../types/pending.types";

export function usePendingComplaints() {
  const [
    pendingComplaints,
    setPendingComplaints,
  ] =
    useState<
      PendingComplaint[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<
      string | null
    >(null);

  const loadPending =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const data =
          await getPendingComplaints();

        setPendingComplaints(
          data
        );
      } catch {
        setError(
          "Unable to load pending complaints."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  return {
    pendingComplaints,

    loading,

    error,

    refetch:
      loadPending,

    setPendingComplaints,
  };
}