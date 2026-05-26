import { EngineCard } from "@/components/engine-card";
import { validatorEngine } from "@/lib/fixtures";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 space-y-2">
        <div className="font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
          GLVE · Operational Walkthrough · 2026
        </div>
        <h1 className="text-4xl font-extrabold tracking-tightest sm:text-5xl">
          A composable{" "}
          <span className="text-muted font-normal">agentic architecture.</span>
        </h1>
        <p className="max-w-2xl text-balance text-[15px] leading-relaxed text-muted">
          This page is the working surface for the Engine Walkthrough. State 02
          — Navy Engine Room — is the first component built out.
        </p>
      </header>

      <EngineCard state="navy-engine-room" data={validatorEngine} />
    </main>
  );
}
