interface TypeSource {
  complaintType?: string;
  repeatComplaintNumber?: string;
  parentComplaintId?: { complaintNumber?: string } | string | null;
}

/**
 * Dealers see a WARRANTY complaint as "Repeat" along with the old
 * complaint number. Other roles see the stored type unchanged.
 */
export function complaintTypeLabel(
  complaint: TypeSource,
  isDealer: boolean,
): string {
  const type = complaint.complaintType || "-";

  if (!isDealer || type !== "WARRANTY") return type;

  const parent =
    typeof complaint.parentComplaintId === "object"
      ? complaint.parentComplaintId?.complaintNumber
      : "";

  const oldNumber = complaint.repeatComplaintNumber || parent;

  return oldNumber ? `Repeat (Old: ${oldNumber})` : "Repeat";
}
