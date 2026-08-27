import ReportPageLayout from "../components/ReportPageLayout";

export default function SLAReportPage() {
  return (
    <ReportPageLayout
      type="SLA"
      statuses={[
        "WITHIN SLA",
        "WARNING",
        "BREACHED",
      ]}
    />
  );
}