import {
  Edit3,
} from "lucide-react";

import type {
  Item,
} from "../types/item.types";

interface Props {
  items: Item[];

  onEdit: (
    item: Item
  ) => void;
}

export default function ItemTable({
  items,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">
                Inventory Name
              </th>

              <th className="px-4 py-3">
                Application Code
              </th>

              <th className="px-4 py-3">
                Purchase Rate
              </th>

              <th className="px-4 py-3">
                Retail Rate
              </th>

              <th className="px-4 py-3">
                Current Stock
              </th>

              <th className="px-4 py-3">
                UOM
              </th>

              <th className="px-4 py-3">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                >
                  <td className="px-4 py-4 font-medium">
                    {
                      item.inventoryName
                    }
                  </td>

                  <td className="px-4 py-4">
                    {item.applicationCode ||
                      "-"}
                  </td>

                  <td className="px-4 py-4">
                    {
                      item.purchaseRate
                    }
                  </td>

                  <td className="px-4 py-4">
                    {
                      item.retailRate
                    }
                  </td>

                  <td className="px-4 py-4">
                    {
                      item.currentStock
                    }
                  </td>

                  <td className="px-4 py-4">
                    {
                      item.uom
                    }
                  </td>

                  <td className="px-4 py-4">
                    {
                      item.status
                    }
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() =>
                        onEdit(
                          item
                        )
                      }
                    >
                      <Edit3
                        size={
                          17
                        }
                      />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}