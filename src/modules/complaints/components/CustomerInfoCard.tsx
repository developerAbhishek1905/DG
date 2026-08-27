import Card from "../../../components/ui/Card";

import type { Customer } from "../types/complaint.types";

interface Props {
  customer: Customer;
}

export default function CustomerInfoCard({
  customer,
}: Props) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900">
        Customer Information
      </h3>

      <div className="mt-4 space-y-3">
        <Info label="Name" value={customer.name} />

        <Info label="Phone" value={customer.phone} />

        {customer.email && (
          <Info label="Email" value={customer.email} />
        )}

        <Info
          label="Address"
          value={`${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`}
        />
      </div>
    </Card>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-sm text-gray-900">
        {value}
      </p>
    </div>
  );
}