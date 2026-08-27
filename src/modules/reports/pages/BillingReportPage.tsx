import ReportPageLayout from "../components/ReportPageLayout";

export default function BillingReportPage() {
  return (
    <ReportPageLayout
      type="BILLING"
      statuses={[
        "DRAFT",
        "PENDING",
        "APPROVED",
        "PAID",
        "REJECTED",
      ]}
    />
  );
}