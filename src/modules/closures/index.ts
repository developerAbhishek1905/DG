export { default as ClosurePage } from "./pages/ClosurePage";

export { default as ClosureHistoryPage } from "./pages/ClosureHistoryPage";

export { default as ClosureTypeSelector } from "./components/ClosureTypeSelector";

export { default as VisitClosureForm } from "./components/VisitClosureForm";

export { default as PartClosureForm } from "./components/PartClosureForm";

export { default as ServiceClosureForm } from "./components/ServiceClosureForm";

export { default as InstallationClosureForm } from "./components/InstallationClosureForm";

export { default as UninstallationClosureForm } from "./components/UninstallationClosureForm";

export { default as ProofUploader } from "./components/ProofUploader";

export { default as ClosureSummary } from "./components/ClosureSummary";

export type {
  ClosureType,
  ClosureStatus,
  ClosureProof,
  ClosureRecord,
  VisitClosureData,
  PartClosureData,
  ServiceClosureData,
  InstallationClosureData,
  UninstallationClosureData,
  SubmitClosurePayload,
} from "./types/closure.types";