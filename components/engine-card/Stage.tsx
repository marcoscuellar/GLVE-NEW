import { cn } from "@/lib/cn";
import type { EngineState, EngineTone } from "./types";

interface Props {
  engineId: string;
  engineName: string;
  tone: EngineTone;
  state: EngineState;
  children: React.ReactNode;
  className?: string;
}

const STATE_LABELS: Record<EngineState, string> = {
  1: "State 01",
  2: "State 02",
  3: "State 03",
};

export function Stage({
  engineId,
  engineName,
  tone,
  state,
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "stage",
        tone === "amber" && "amber",
        tone === "navy" && "navy",
        `state-0${state}`,
        className,
      )}
    >
      <div className="stage-head">
        <div className="stage-eng">
          <span className="badge">{engineId}</span>
          <span className="name">{engineName}</span>
        </div>
        <div className="stage-state">
          {([1, 2, 3] as EngineState[]).map((s) => (
            <span key={s} className={cn("pill", s === state && "live")}>
              {STATE_LABELS[s]}
            </span>
          ))}
        </div>
      </div>
      <div className="stage-body">
        <div className="layer show">{children}</div>
      </div>
    </div>
  );
}
