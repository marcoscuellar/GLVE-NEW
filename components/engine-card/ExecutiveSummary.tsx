import { cn } from "@/lib/cn";
import type { EngineCardData } from "./types";

interface Props {
  data: EngineCardData;
  className?: string;
}

// Placeholder for State 01. Final design lands after the prototype source export.
export function ExecutiveSummary({ data, className }: Props) {
  return (
    <section
      aria-label={`${data.name} — Executive Summary`}
      className={cn(
        "rounded-[28px] border border-line bg-white p-8 shadow-card",
        className,
      )}
    >
      <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
        State 01 · Executive Summary
      </div>
      <h2 className="text-balance text-3xl font-bold tracking-tightest">
        {data.name}
      </h2>
      <p className="mt-3 max-w-xl text-balance text-[15px] leading-relaxed text-muted">
        {data.summary}
      </p>
    </section>
  );
}
