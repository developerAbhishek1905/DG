import {
  useEffect,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import SettingsSidebar from "../components/SettingsSidebar";
import SLASettingsForm from "../components/SLASettingsForm";

import {
  fetchSettings,
  saveSLASettings,
} from "../store/settingsSlice";

import type {
  SLASettings,
} from "../types/settings.types";

export default function SLASettingsPage() {
  const dispatch =
    useAppDispatch();

  const {
    sla,
    loading,
    saving,
  } =
    useAppSelector(
      (state) =>
        state.settings
    );

  useEffect(() => {
    if (!sla) {
      dispatch(
        fetchSettings()
      );
    }
  }, [
    dispatch,
    sla,
  ]);

  const handleSubmit =
    async (
      data: SLASettings
    ) => {
      await dispatch(
        saveSLASettings(
          data
        )
      );
    };

  return (
    <SettingsLayout
      title="SLA Settings"
      description="Configure SLA durations, warning thresholds and escalation behavior."
    >
      {loading || !sla ? (
        <Loading />
      ) : (
        <SLASettingsForm
          settings={sla}
          saving={saving}
          onSubmit={
            handleSubmit
          }
        />
      )}
    </SettingsLayout>
  );
}

function SettingsLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <p className="py-10 text-center text-sm text-gray-500">
      Loading settings...
    </p>
  );
}