import api from "../../services/api/axios";

export interface DealerLeave {
  _id: string;
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  reason: string;
  status: "ACTIVE" | "CANCELLED";
  createdAt: string;
}

export async function getMyLeaves(): Promise<DealerLeave[]> {
  const res = await api.get("/dealer-leaves/my");
  return res.data?.data || [];
}

export async function registerLeave(payload: {
  fromDate: string;
  toDate: string;
  reason: string;
}): Promise<DealerLeave> {
  const res = await api.post("/dealer-leaves", payload);
  return res.data?.data;
}

export async function cancelLeave(id: string): Promise<DealerLeave> {
  const res = await api.patch(`/dealer-leaves/${id}/cancel`);
  return res.data?.data;
}
