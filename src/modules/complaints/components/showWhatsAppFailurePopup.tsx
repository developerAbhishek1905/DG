import { createRoot } from "react-dom/client";
import { useState } from "react";

export type WhatsAppPartyResult = {
  status: "SENT" | "FAILED" | "NOT_APPLICABLE";
  name?: string;
  mobile?: string;
  error?: string;
};

export type WhatsAppSummary = {
  customer?: WhatsAppPartyResult;
  dealer?: WhatsAppPartyResult;
};

const Popup = ({
  summary,
  complaintNumber,
  onClose,
}: {
  summary: WhatsAppSummary;
  complaintNumber?: string;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const rows = [
    { label: "Customer", r: summary.customer },
    { label: "Dealer", r: summary.dealer },
  ].filter((x) => x.r && x.r.status === "FAILED");

  const close = () => {
    setOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-red-600">
          WhatsApp message not sent
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Complaint{complaintNumber ? ` ${complaintNumber}` : ""} registered
          successfully, but the WhatsApp message failed:
        </p>
        <ul className="mt-3 space-y-2">
          {rows.map(({ label, r }) => (
            <li
              key={label}
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm"
            >
              <div className="font-medium text-gray-800">
                {label}
                {r?.name ? ` - ${r.name}` : ""}
                {r?.mobile ? ` (${r.mobile})` : ""}
              </div>
              <div className="mt-0.5 break-words text-red-700">
                {r?.error || "WhatsApp API failed"}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/** Shows a popup only if any WhatsApp message failed. Mounts itself so it
 *  survives the complaint form closing. */
export const showWhatsAppFailurePopup = (
  summary?: WhatsAppSummary,
  complaintNumber?: string,
) => {
  if (!summary) return;
  const failed =
    summary.customer?.status === "FAILED" ||
    summary.dealer?.status === "FAILED";
  if (!failed) return;

  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(
    <Popup
      summary={summary}
      complaintNumber={complaintNumber}
      onClose={() => {
        root.unmount();
        host.remove();
      }}
    />,
  );
};
