import ReportPageLayout from "../components/ReportPageLayout";

export default function ComplaintReportPage() {
  return (
    <ReportPageLayout
      type="COMPLAINT"
      statuses={[
        "OPEN",
        "ALLOCATED",
        "APPOINTMENT",
        "PENDING",
        "VERIFICATION",
        "CLOSED",
        "CANCELLED",
      ]}
    />
  );
}