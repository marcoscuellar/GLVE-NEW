import { EngineCard } from "@/components/engine-card";
import { EngineWalkthrough } from "@/components/engine-walkthrough";
import { WarRoomDashboard } from "@/components/war-room";
import { ENGINES } from "@/lib/engines";

export default function Page() {
  // The Validator engine is engine 01 — used here as the State 02 showcase
  // at the top of the page (the user's first ask).
  const headline = ENGINES[0];

  return (
    <main>
      {/* HERO */}
      <header className="mx-auto max-w-[1480px] px-14 pb-20 pt-32">
        <div className="mb-14 inline-flex items-center gap-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2 before:h-px before:w-9 before:bg-ink-2 before:content-['']">
          — Operational Walkthrough · 2026
        </div>
        <h1 className="max-w-[16ch] text-[clamp(56px,8vw,124px)] font-extrabold leading-[0.92] tracking-tightest">
          A composable
          <span className="block font-normal text-ink-3">
            agentic architecture.
          </span>
        </h1>
        <p className="mt-9 max-w-[60ch] text-[19px] leading-[1.55] text-ink-2">
          Six specialized intelligence engines. Defined mandates. Verified
          handoffs. Built so an operator experiences calm — and the
          infrastructure handles the complexity underneath.
        </p>
      </header>

      {/* STATE 02 SHOWCASE — standalone Navy Engine Room render */}
      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
          <span>State 02 · Navy Engine Room — standalone preview</span>
          <span>engine 01 · Role Validation</span>
        </div>
        <div className="h-[640px]">
          <EngineCard engine={headline} state={2} />
        </div>
      </section>

      {/* THE WALKTHROUGH */}
      <EngineWalkthrough engines={ENGINES} />

      {/* WAR ROOM */}
      <WarRoomDashboard />
    </main>
  );
}
