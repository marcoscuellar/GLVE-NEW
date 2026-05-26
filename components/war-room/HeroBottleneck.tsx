import { cn } from "@/lib/cn";

interface LatencyRow {
  label: string;
  pct: number;
  value: string;
  critical?: boolean;
}

interface Props {
  flag: string;
  meta: string;
  metricValue: string;
  metricUnit: string;
  delta: string;
  captionLabel: string;
  captionHeadline: string;
  captionBody: string;
  chartTitle: string;
  chartFoot: string;
  rows: LatencyRow[];
  ctaLabel: string;
  ctaHeadline: string;
  href?: string;
}

export function HeroBottleneck({
  flag,
  meta,
  metricValue,
  metricUnit,
  delta,
  captionLabel,
  captionHeadline,
  captionBody,
  chartTitle,
  chartFoot,
  rows,
  ctaLabel,
  ctaHeadline,
  href = "#",
}: Props) {
  return (
    <article className="vis-hero">
      <header className="vh-head">
        <div className="vh-tag">
          <span className="vh-pulse" />
          <span>[ Workflow bottleneck · step latency ]</span>
        </div>
        <div className="vh-meta">
          <span className="vh-flag">{flag}</span>
          <span>{meta}</span>
        </div>
      </header>

      <div className="vh-spotlight">
        <div className="vh-num-wrap">
          <div className="vh-num">
            {metricValue}
            <span className="vh-unit">{metricUnit}</span>
          </div>
          <div className="vh-delta">{delta}</div>
        </div>
        <div className="vh-caption">
          <div className="vh-cap-lbl">{captionLabel}</div>
          <div className="vh-cap-h">{captionHeadline}</div>
          <div className="vh-cap-d">{captionBody}</div>
        </div>
      </div>

      <div className="vh-chart">
        <div className="vh-chart-head">
          <span>{chartTitle}</span>
          <span>{chartFoot}</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.label}
            className={cn("vh-lat-row", r.critical && "critical")}
          >
            <span className="lat-k">{r.label}</span>
            <span className="lat-bar">
              <i style={{ width: `${r.pct}%` }} />
            </span>
            <span className="lat-v">{r.value}</span>
          </div>
        ))}
      </div>

      <a className="vh-cta" href={href} role="button">
        <span className="vh-cta-lbl">{ctaLabel}</span>
        <span className="vh-cta-h">{ctaHeadline}</span>
        <span className="vh-cta-arrow" aria-hidden>
          →
        </span>
      </a>
    </article>
  );
}
