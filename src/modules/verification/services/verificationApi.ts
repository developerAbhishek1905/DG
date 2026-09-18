import api from "../../../services/api/axios";
import type { CorrectionRequestPayload, RejectVerificationPayload, VerificationRecord, VerifyComplaintPayload } from "../types/verification.types";
// Keep the revision the reviewer actually saw; reject stale approval after resubmission.
const revisions = new Map<string, number>();
function remember(record: VerificationRecord) { revisions.set(record.id, record.revision ?? 1); return record; }
export async function getVerificationQueue(): Promise<VerificationRecord[]> {
  const { data } = await api.get("/verification"); return data.data.map(remember);
}
export async function getVerificationById(id: string): Promise<VerificationRecord> {
  const { data } = await api.get(`/verification/${id}`); return remember(data.data);
}
async function decide(id: string, action: string, payload: { revision?: number; [key: string]: unknown } = {}) {
  const { data } = await api.post(`/verification/${id}/${action}`, { ...payload, revision: payload.revision ?? revisions.get(id) }); return remember(data.data);
}
export const startVerification = (id: string) => decide(id, "start");
export const verifyComplaint = (payload: VerifyComplaintPayload) => decide(payload.verificationId, "verify", { ...payload });
export const rejectVerification = (payload: RejectVerificationPayload) => decide(payload.verificationId, "reject", { ...payload });
export const requestCorrection = (payload: CorrectionRequestPayload) => decide(payload.verificationId, "correction", { ...payload, reason: [payload.reason, ...payload.requiredCorrections].join(" — ") });
