import ReportPageLayout from "../components/ReportPageLayout";

export default function CancellationReportPage() {
  return (
    <ReportPageLayout
      type="CANCELLATION"
      statuses={[
        "PENDING",
        "APPROVED",
        "REJECTED",
      ]}
    />
  );
}