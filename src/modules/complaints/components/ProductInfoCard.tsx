import Card from "../../../components/ui/Card";

import type { Product } from "../types/complaint.types";

interface Props {
  product?: Product;
}

export default function ProductInfoCard({
  product,
}: Props) {
  if (!product) return null;

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900">
        Product Information
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Info label="Product" value={product.name} />

        <Info label="Model" value={product.model} />

        <Info
          label="Serial Number"
          value={product.serialNumber ?? "-"}
        />

        <Info
          label="Warranty"
          value={product.warrantyStatus ?? "-"}
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
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}