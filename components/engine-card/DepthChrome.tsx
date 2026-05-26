import { cn } from "@/lib/cn";
import type { DepthSource, DepthTelemetryCell } from "./types";

export function SourceStrip({ sources }: { sources: DepthSource[] }) {
  return (
    <div className="api-strip">
      <span className="api-lbl">Sources</span>
      {sources.map((s) => (
        <span
          key={s.code}
          className={cn(
            "api-chip",
            s.live && "live",
            s.more && "more",
          )}
          title={s.name}
        >
          {s.code}
        </span>
      ))}
    </div>
  );
}

export function Telemetry({ cells }: { cells: DepthTelemetryCell[] }) {
  return (
    <div className="telemetry">
      {cells.map((c) => (
        <div key={c.k} className={cn("t-cell", c.live && "live")}>
          <div className="t-k">{c.k}</div>
          <div className="t-v">{c.v}</div>
        </div>
      ))}
    </div>
  );
}

export function DepthHead({
  title,
  meterLabel,
  meterPct,
}: {
  title: string;
  meterLabel: string;
  meterPct: number;
}) {
  return (
    <div className="depth-head">
      <span className="ttl">{title}</span>
      <span className="meter">
        {meterLabel}
        <span className="bar">
          <i style={{ width: `${meterPct}%` }} />
        </span>
      </span>
    </div>
  );
}
