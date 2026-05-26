import { Stage } from "./Stage";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { OperationalDepth } from "./OperationalDepth";
import { DualOutput } from "./DualOutput";
import type { Engine, EngineState } from "./types";

export interface EngineCardProps {
  engine: Engine;
  state: EngineState;
  className?: string;
}

export function EngineCard({ engine, state, className }: EngineCardProps) {
  return (
    <Stage
      engineId={engine.id}
      engineName={engine.name}
      tone={engine.tone}
      state={state}
      className={className}
    >
      {state === 1 && <ExecutiveSummary engine={engine} />}
      {state === 2 && <OperationalDepth engine={engine} />}
      {state === 3 && <DualOutput engine={engine} />}
    </Stage>
  );
}
