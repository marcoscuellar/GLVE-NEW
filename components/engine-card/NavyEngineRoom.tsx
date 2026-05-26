import { cn } from "@/lib/cn";
import type { EngineCardData, SignalLevel } from "./types";

const levelDot: Record<SignalLevel, string> = {
  green: "bg-signal-green shadow-[0_0_12px_rgba(34,197,94,0.55)]",
  amber: "bg-signal-amber shadow-[0_0_12px_rgba(245,158,11,0.55)]",
  red: "bg-signal-red shadow-[0_0_12px_rgba(239,68,68,0.55)]",
};

const stageStyle = {
  complete: "border-white/15 bg-white/[0.04] text-navy-100",
  active:
    "border-signal-green/60 bg-signal-green/10 text-white ring-1 ring-signal-green/40",
  queued: "border-white/10 bg-transparent text-navy-300",
} as const;

interface Props {
  data: EngineCardData;
  className?: string;
}

export function NavyEngineRoom({ data, className }: Props) {
  return (
    <section
      aria-label={`${data.name} — Navy Engine Room`}
      className={cn(
        "relative isolate overflow-hidden rounded-[28px]",
        "bg-navy-900 text-navy-50",
        "shadow-navy-lift ring-1 ring-white/5",
        className,
      )}
    >
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 scrim-radial" />
      <div className="pointer-events-none absolute inset-0 grid-engine opacity-60" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full bg-steel/30 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-start justify-between gap-6 border-b border-white/5 px-8 pt-8 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-navy-200/80 uppercase">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-signal-green animate-pulseDot" />
            State 02 · Engine Room
            <span className="text-navy-300/60">/</span>
            <span className="text-navy-100">{data.codename}</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tightest text-white sm:text-4xl">
            {data.name}
          </h2>
          <p className="max-w-xl text-balance text-[15px] leading-relaxed text-navy-100/80">
            {data.summary}
          </p>
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
          <span className="font-mono text-[10px] tracking-[0.25em] text-navy-200/60 uppercase">
            Runtime
          </span>
          <span className="font-mono text-2xl font-semibold tracking-tight text-white tabular-nums">
            00:04:21
          </span>
          <span className="font-mono text-[11px] text-signal-green/90 tabular-nums">
            +12.4% throughput
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 grid gap-6 px-8 py-7 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left column: pipeline + metrics */}
        <div className="space-y-6">
          {/* Pipeline */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-[11px] tracking-[0.25em] text-navy-200/70 uppercase">
                Pipeline
              </h3>
              <span className="font-mono text-[11px] text-navy-200/60 tabular-nums">
                {data.pipeline.filter((s) => s.status === "complete").length}/
                {data.pipeline.length} stages
              </span>
            </div>
            <ol className="relative grid gap-2">
              <div className="pointer-events-none absolute inset-y-2 left-3 w-px bg-white/10" />
              {data.pipeline.map((stage, i) => (
                <li
                  key={stage.id}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl border px-3.5 py-2.5 backdrop-blur-sm transition-colors",
                    stageStyle[stage.status],
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
                      stage.status === "complete" && "bg-navy-100",
                      stage.status === "active" &&
                        "bg-signal-green animate-pulseDot",
                      stage.status === "queued" && "bg-white/20",
                    )}
                  />
                  <span className="font-mono text-[10px] tracking-widest text-navy-200/60 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-white/90">
                    {stage.name}
                  </span>
                  {stage.durationMs != null && (
                    <span className="ml-auto font-mono text-[11px] text-navy-200/70 tabular-nums">
                      {stage.durationMs} ms
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="mb-3 font-mono text-[11px] tracking-[0.25em] text-navy-200/70 uppercase">
              Live signals
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-navy-200/60 uppercase">
                      {m.label}
                    </span>
                    {m.level && (
                      <span
                        className={cn(
                          "inline-flex h-1.5 w-1.5 rounded-full",
                          levelDot[m.level],
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
                      {m.value}
                    </span>
                    {m.delta && (
                      <span className="font-mono text-[11px] text-signal-green/90 tabular-nums">
                        {m.delta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: log stream */}
        <div className="flex min-h-[320px] flex-col rounded-2xl border border-white/10 bg-navy-950/70 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-signal-green animate-pulseDot" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-navy-200/70 uppercase">
                Trace · stdout
              </span>
            </div>
            <span className="font-mono text-[11px] text-navy-200/50 tabular-nums">
              {data.logs.length} events
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <ol className="space-y-1.5 px-4 py-3 font-mono text-[12.5px] leading-relaxed">
              {data.logs.map((log, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-navy-200/50 tabular-nums">
                    {log.ts}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-semibold",
                      log.level === "green" && "text-signal-green",
                      log.level === "amber" && "text-signal-amber",
                      log.level === "red" && "text-signal-red",
                      !log.level && "text-steel",
                    )}
                  >
                    {log.channel}
                  </span>
                  <span className="text-navy-100/85">{log.body}</span>
                </li>
              ))}
            </ol>
            {/* Flowing bar at bottom of log */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden bg-white/5">
              <div className="h-full w-1/3 bg-signal-green/70 animate-flow" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer rail */}
      <footer className="relative z-10 flex items-center justify-between gap-4 border-t border-white/5 bg-navy-950/60 px-8 py-4 font-mono text-[11px] tracking-wider text-navy-200/70">
        <span className="uppercase">
          glve.engine.{data.id} · scheduler=fair · region=us-east
        </span>
        <span className="flex items-center gap-4 tabular-nums">
          <span>cpu 38%</span>
          <span>mem 612 MB</span>
          <span className="text-signal-green">healthy</span>
        </span>
      </footer>
    </section>
  );
}
