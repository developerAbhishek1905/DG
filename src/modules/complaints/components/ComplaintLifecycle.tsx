import Card from "../../../components/ui/Card";

import type {
  ComplaintStatus,
} from "../types/complaint.types";

const steps: ComplaintStatus[] = [
  "REGISTERED",
  "ALLOCATED",
  "APPOINTMENT_SCHEDULED",
  "WORK_IN_PROGRESS",
  "WORK_COMPLETED",
  "DG_VERIFICATION",
  "CLOSED",
];

interface Props {
  currentStatus: ComplaintStatus;
}

export default function ComplaintLifecycle({
  currentStatus,
}: Props) {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900">
        Complaint Lifecycle
      </h3>

      <div className="mt-6 overflow-x-auto">
        <div className="flex min-w-[700px] items-start">
          {steps.map((step, index) => {
            const completed =
              index <= currentIndex;

            return (
              <div
                key={step}
                className="flex flex-1 items-start"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center
                      rounded-full text-xs font-bold
                      ${
                        completed
                          ? "bg-[#123B7A] text-white"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {index + 1}
                  </div>

                  <span className="mt-2 max-w-[100px] text-center text-[11px] text-gray-500">
                    {step.replaceAll("_", " ")}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      mt-4 h-0.5 flex-1
                      ${
                        index < currentIndex
                          ? "bg-[#123B7A]"
                          : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}