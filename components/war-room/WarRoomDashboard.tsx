import { HeroBottleneck } from "./HeroBottleneck";
import {
  CoachingCard,
  SignalQualityCard,
  StuckCard,
} from "./SecondaryCards";

export function WarRoomDashboard() {
  return (
    <section
      className="mx-auto max-w-[1480px] px-14 py-32"
      data-screen-label="06 Operational Visibility"
    >
      <div className="mb-9 inline-flex items-center gap-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ink-2 before:h-px before:w-9 before:bg-ink-2 before:content-['']">
        05 · Operational visibility
      </div>
      <h2 className="mb-6 max-w-[22ch] text-[clamp(40px,5.4vw,76px)] font-bold leading-[0.98] tracking-tighter">
        Not analytics.{" "}
        <span className="font-normal text-ink-3">Workflow intelligence.</span>
      </h2>
      <p className="mb-16 max-w-[64ch] text-[18px] leading-[1.55] text-ink-2">
        Because every engine produces a strategic audit and a verified handoff,
        the architecture itself becomes legible. Bottlenecks surface. Signal
        quality is measurable. Coaching becomes specific. The system enforces
        operational consistency by design.
      </p>

      <div className="vis-spotlight">
        <HeroBottleneck
          flag="CRITICAL"
          meta="p95 · today · 14:07 EST"
          metricValue="13"
          metricUnit="s"
          delta="+ 8s over pipeline median"
          captionLabel="03 · Stakeholder Map"
          captionHeadline="Reps stall here."
          captionBody="Step latency is the diagnostic signal — and the coaching target. Every engine downstream of 03 inherits this delay."
          chartTitle="Step latency · all engines · p95"
          chartFoot="end-to-end 36s"
          rows={[
            { label: "01 Role Validation", pct: 22, value: "4s" },
            { label: "02 Buying Signals", pct: 38, value: "7s" },
            {
              label: "03 Stakeholder Map",
              pct: 100,
              value: "13s",
              critical: true,
            },
            { label: "04 Outreach Arch.", pct: 31, value: "6s" },
            { label: "05 Timing · Orch.", pct: 16, value: "3s" },
            { label: "06 Audit & Delivery", pct: 19, value: "3s" },
          ]}
          ctaLabel="[ COACHING SURFACE ]"
          ctaHeadline="Open 03 · Stakeholder Map"
        />

        <div className="vis-side">
          <StuckCard />
          <SignalQualityCard />
          <CoachingCard />
        </div>
      </div>

      <div className="vis-quote">
        The architecture <strong>is</strong> the observability. Every reasoning
        step, every handoff, every variable — logged, sourced, replayable.
      </div>
    </section>
  );
}
