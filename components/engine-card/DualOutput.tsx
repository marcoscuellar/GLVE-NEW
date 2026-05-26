import { cn } from "@/lib/cn";
import type { EngineCardData } from "./types";

interface Props {
  data: EngineCardData;
  className?: string;
}

// Placeholder for State 03. Final design lands after the prototype source export.
export function DualOutput({ data, className }: Props) {
  const primary = data.output?.primary;
  const secondary = data.output?.secondary;
  return (
    <section
      aria-label={`${data.name} — Dual Output`}
      className={cn(
        "grid gap-4 rounded-[28px] border border-line bg-white p-8 shadow-card md:grid-cols-2",
        className,
      )}
    >
      <div className="mb-3 font-mono text-[11px] tracking-[0.3em] text-muted uppercase md:col-span-2">
        State 03 · Dual Output
      </div>
      {primary && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-lg font-semibold">{primary.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            {primary.body}
          </p>
        </div>
      )}
      {secondary && (
        <div className="rounded-2xl border border-line bg-navy-900 p-5 text-navy-50">
          <h3 className="text-lg font-semibold text-white">{secondary.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-100/85">
            {secondary.body}
          </p>
        </div>
      )}
    </section>
  );
}
