import {
  CheckCircle2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function AuthBranding() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#123B7A] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-[#123B7A]">
            DG
          </div>

          <div>
            <h2 className="text-xl font-bold">
              DG Service
            </h2>

            <p className="text-xs text-blue-200">
              Service Management
            </p>
          </div>
        </div>

        <div className="mt-24 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight">
            Manage service operations
            from one place.
          </h1>

          <p className="mt-5 text-base leading-7 text-blue-100">
            Manage complaints,
            dealers, appointments,
            verification, billing and
            payments efficiently.
          </p>

          <div className="mt-10 space-y-5">
            <Feature
              icon={Wrench}
              text="Complaint lifecycle management"
            />

            <Feature
              icon={ShieldCheck}
              text="Role based access control"
            />

            <Feature
              icon={CheckCircle2}
              text="Dealer performance tracking"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-blue-200">
        © 2026 DG Service Management
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
        <Icon size={19} />
      </div>

      <span className="text-sm">
        {text}
      </span>
    </div>
  );
}