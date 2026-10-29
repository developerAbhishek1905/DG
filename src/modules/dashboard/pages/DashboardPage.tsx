import { DashboardSkeleton } from "../../../components/ui/Skeleton";
import {
  useEffect,
  useState,
} from "react";

import ComplaintStats from "../components/ComplaintStats";
import ComplaintStatusChart from "../components/ComplaintStatusChart";
import ComplaintTrendChart from "../components/ComplaintTrendChart";
import DashboardHeader from "../components/DashboardHeader";
import DealerPerformanceChart from "../components/DealerPerformanceChart";
import KPIGrid from "../components/KPIGrid";
import QuickActions from "../components/QuickActions";
import RecentComplaints from "../components/RecentComplaints";
import SLAPerformanceChart from "../components/SLAPerformanceChart";

import {
  getDashboardData,
  type DashboardData,
} from "../services/dashboardApi";

export default function DashboardPage() {
  const [
    data,
    setData,
  ] =
    useState<
      DashboardData | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const loadDashboard =
    async () => {
      try {
        setLoading(true);

        setError(null);

        const response =
          await getDashboardData();

        setData(
          response
        );
      } catch {
        setError(
          "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardSkeleton />
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-medium text-red-700">
          {error ??
            "Dashboard unavailable."}
        </p>

        <button
          onClick={
            loadDashboard
          }
          className="mt-4 rounded-lg bg-[#6D28D9] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        onRefresh={
          loadDashboard
        }
      />

      <KPIGrid
        kpis={
          data.kpis
        }
      />

      <ComplaintStats
        kpis={
          data.kpis
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComplaintTrendChart
            data={
              data.complaintTrend
            }
          />
        </div>

        <ComplaintStatusChart
          data={
            data.complaintStatus
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DealerPerformanceChart
            data={
              data.dealerPerformance
            }
          />
        </div>

        <SLAPerformanceChart
          data={
            data.slaPerformance
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentComplaints
            complaints={
              data.recentComplaints
            }
          />
        </div>

        <QuickActions />
      </div>
    </div>
  );
}