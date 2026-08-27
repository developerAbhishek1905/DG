export type ReportType =
  | "COMPLAINT"
  | "DEALER"
  | "SLA"
  | "CANCELLATION"
  | "BILLING"
  | "PAYMENT";

export type ReportPeriod =
  | "TODAY"
  | "7_DAYS"
  | "30_DAYS"
  | "THIS_MONTH"
  | "CUSTOM";

export interface ReportFiltersData {
  search: string;
  period: ReportPeriod;
  dateFrom: string;
  dateTo: string;
  status: string;
  dealerId: string;
  city: string;
}

export interface ReportSummaryItem {
  label: string;
  value: string | number;
  helper?: string;
}

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

export interface ReportRow {
  id: string;
  [key: string]: string | number | undefined;
}

export interface ReportChartItem {
  label: string;
  value: number;
}

export interface ReportData {
  title: string;
  description: string;

  summary: ReportSummaryItem[];

  columns: ReportColumn[];

  rows: ReportRow[];

  chart: ReportChartItem[];
}

export interface ReportRequest {
  type: ReportType;
  filters: ReportFiltersData;
}

export interface ReportDefinition {
  type: ReportType;
  title: string;
  description: string;
  path: string;
}