export { default as DashboardPage } from "./pages/DashboardPage";

export { default as DashboardHeader } from "./components/DashboardHeader";

export { default as KPIGrid } from "./components/KPIGrid";

export { default as ComplaintStats } from "./components/ComplaintStats";

export { default as ComplaintTrendChart } from "./components/ComplaintTrendChart";

export { default as ComplaintStatusChart } from "./components/ComplaintStatusChart";

export { default as DealerPerformanceChart } from "./components/DealerPerformanceChart";

export { default as SLAPerformanceChart } from "./components/SLAPerformanceChart";

export { default as RecentComplaints } from "./components/RecentComplaints";

export { default as QuickActions } from "./components/QuickActions";

export type {
  DashboardData,
  DashboardKPI,
  ComplaintTrendItem,
  ComplaintStatusItem,
  DealerPerformanceItem,
  SLAPerformanceItem,
  RecentComplaint,
} from "./services/dashboardApi";