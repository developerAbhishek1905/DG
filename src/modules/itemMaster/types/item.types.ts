export type ItemStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Item {
  id: string;

  groupCategoryId: string;

  applicationCode?: string;

  inventoryName: string;

  alternatePartNumber?: string;

  description?: string;

  specification?: string;

  purchaseRate?: number;

  retailRate?: number;

  discountPercent?: number;

  openingStock?: number;

  currentStock?: number;

  hsnCode?: string;

  taxRate?: number;

  uom?: string;

  locked: boolean;

  itemDeactivated: boolean;

  kirloskarOrder: boolean;

  minimumLevel?: number;

  maximumLevel?: number;

  reorderLevel?: number;

  exciseApplicable?: string;

  minimumOrderQuantity?: number;

  underBectorFlow: boolean;

  length?: number;

  size?: string;

  location?: string;

  status: ItemStatus;

  createdAt: string;

  updatedAt: string;
}

export interface ItemFormData {
  groupCategoryId: string;

  applicationCode?: string;

  inventoryName: string;

  alternatePartNumber?: string;

  description?: string;

  specification?: string;

  purchaseRate?: number;

  retailRate?: number;

  discountPercent?: number;

  openingStock?: number;

  currentStock?: number;

  hsnCode?: string;

  taxRate?: number;

  uom?: string;

  locked: boolean;

  itemDeactivated: boolean;

  kirloskarOrder: boolean;

  minimumLevel?: number;

  maximumLevel?: number;

  reorderLevel?: number;

  exciseApplicable?: string;

  minimumOrderQuantity?: number;

  underBectorFlow: boolean;

  length?: number;

  size?: string;

  location?: string;

  status: ItemStatus;
}

export interface ItemState {
  items: Item[];

  selectedItem:
    | Item
    | null;

  loading: boolean;

  actionLoading: boolean;

  error:
    | string
    | null;
}