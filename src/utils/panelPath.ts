/**
 * Dealer users work in a separate panel mounted under `/dealer`.
 * CRM users keep the original root paths.
 * Reads the stored login user so it also works outside React components.
 */
const isDealerStored = (): boolean => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return false;
    return JSON.parse(raw)?.role?.code === "DEALER";
  } catch {
    return false;
  }
};

export const DEALER_BASE = "/dealer";

export const getPanelBase = (): string => (isDealerStored() ? DEALER_BASE : "");

export const panelPath = (path: string): string => `${getPanelBase()}${path}`;

export const getHomePath = (roleCode?: string): string =>
  roleCode === "DEALER" ? DEALER_BASE : "/dashboard";
