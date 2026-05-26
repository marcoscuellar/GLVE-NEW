import { ExecutiveSummary } from "./ExecutiveSummary";
import { NavyEngineRoom } from "./NavyEngineRoom";
import { DualOutput } from "./DualOutput";
import type { EngineCardData, EngineState } from "./types";

export interface EngineCardProps {
  state: EngineState;
  data: EngineCardData;
  className?: string;
}

export function EngineCard({ state, data, className }: EngineCardProps) {
  switch (state) {
    case "executive-summary":
      return <ExecutiveSummary data={data} className={className} />;
    case "navy-engine-room":
      return <NavyEngineRoom data={data} className={className} />;
    case "dual-output":
      return <DualOutput data={data} className={className} />;
  }
}

export type { EngineCardData, EngineState };
