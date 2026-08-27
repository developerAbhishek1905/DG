import ReportPageLayout from "../components/ReportPageLayout";

export default function PaymentReportPage() {
  return (
    <ReportPageLayout
      type="PAYMENT"
      statuses={[
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
        "REVERSED",
      ]}
    />
  );
}