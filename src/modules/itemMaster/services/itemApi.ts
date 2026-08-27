import type {
  Item,
  ItemFormData,
} from "../types/item.types";

export let mockItems: Item[] =
  [
    {
      id: "ITEM-001",

      groupCategoryId:
        "CAT-001",

      applicationCode:
        "APP-WM-01",

      inventoryName:
        "Ludhiana_Inventory",

      alternatePartNumber:
        "ALT-001",

      description:
        "Washing machine motor",

      specification:
        "220V 50Hz",

      purchaseRate: 1000,

      retailRate: 1400,

      discountPercent: 5,

      openingStock: 20,

      currentStock: 15,

      hsnCode: "8501",

      taxRate: 18,

      uom: "PCS",

      locked: false,

      itemDeactivated:
        false,

      kirloskarOrder:
        false,

      minimumLevel: 5,

      maximumLevel: 50,

      reorderLevel: 10,

      exciseApplicable:
        "NO",

      minimumOrderQuantity:
        1,

      underBectorFlow:
        false,

      length: 0,

      size: "",

      location:
        "Rack A-1",

      status: "ACTIVE",

      createdAt:
        "2026-08-01T10:00:00",

      updatedAt:
        "2026-08-01T10:00:00",
    },
  ];

const delay = (
  ms = 300
) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const getItems =
  async (): Promise<
    Item[]
  > => {
    await delay();

    return [...mockItems];
  };

export const getItemById =
  async (
    id: string
  ): Promise<
    Item | undefined
  > => {
    await delay();

    return mockItems.find(
      (item) =>
        item.id === id
    );
  };

export const createItem =
  async (
    data: ItemFormData
  ): Promise<Item> => {
    await delay();

    const now =
      new Date().toISOString();

    const item: Item = {
      id: `ITEM-${String(
        mockItems.length + 1
      ).padStart(3, "0")}`,

      ...data,

      createdAt: now,

      updatedAt: now,
    };

    mockItems = [
      item,
      ...mockItems,
    ];

    return item;
  };

export const updateItem =
  async (
    id: string,
    data: ItemFormData
  ): Promise<Item> => {
    await delay();

    const index =
      mockItems.findIndex(
        (item) =>
          item.id === id
      );

    if (index === -1) {
      throw new Error(
        "Item not found"
      );
    }

    const updated: Item = {
      ...mockItems[index],

      ...data,

      updatedAt:
        new Date().toISOString(),
    };

    mockItems[index] =
      updated;

    return updated;
  };