import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  Appointment,
} from "../types/appointment.types";

import {
  getAppointmentById,
  getAppointments,
} from "../services/appointmentApi";

export function useAppointments() {
  const [
    appointments,
    setAppointments,
  ] =
    useState<
      Appointment[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<
      string | null
    >(null);

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const data =
          await getAppointments();

        setAppointments(data);
      } catch {
        setError(
          "Unable to load appointments."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,

    loading,

    error,

    refetch:
      loadAppointments,

    setAppointments,
  };
}

export function useAppointmentDetails(
  id?: string
) {
  const [
    appointment,
    setAppointment,
  ] =
    useState<
      Appointment | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);

      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getAppointmentById(
              id
            );

          setAppointment(
            data ?? null
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [id]);

  return {
    appointment,
    loading,
    setAppointment,
  };
}