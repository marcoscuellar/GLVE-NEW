export function PresentationCover() {
  return (
    <section
      aria-label="Presentation cover"
      className="relative isolate flex min-h-screen flex-col justify-between bg-white px-14 pb-14 pt-20"
    >
      {/* Top bar — GLVE wordmark */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-r-2"
            style={{ background: "var(--ink)" }}
          >
            <svg viewBox="0 0 100 100" width="18" height="18">
              <rect x="10" y="34" width="80" height="32" rx="5" fill="#fff" />
              <circle cx="70" cy="50" r="14" fill="#0a0a0a" />
              <circle cx="70" cy="50" r="7" fill="#fff" />
            </svg>
          </span>
          <span className="text-[20px] font-bold tracking-tight">GLVE</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
          <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-green align-middle shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
          Live walkthrough · 2026
        </div>
      </header>

      {/* Center block */}
      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <div className="mb-9 inline-flex items-center gap-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ink-2 before:h-px before:w-9 before:bg-ink-2 before:content-['']">
            Operational Walkthrough · Private Briefing
          </div>
          <h1 className="max-w-[14ch] text-[clamp(72px,9vw,148px)] font-extrabold leading-[0.9] tracking-tightest">
            A composable
            <span className="block font-normal text-ink-3">
              agentic architecture.
            </span>
          </h1>
        </div>

        <div className="space-y-10 lg:pb-3">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              Prepared for
            </div>
            <div className="space-y-1 text-[clamp(28px,3vw,40px)] font-bold leading-[1.05] tracking-tighter">
              <div>Laura Baum</div>
              <div>Patrick Reynolds</div>
            </div>
          </div>

          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              By
            </div>
            <div className="text-[clamp(22px,2.2vw,30px)] font-semibold tracking-tight">
              Marcos Cuellar
            </div>
          </div>
        </div>
      </div>

      {/* Footer rail */}
      <footer className="flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
        <span className="inline-flex items-center gap-3 before:inline-block before:h-px before:w-6 before:bg-ink-3 before:content-['']">
          Scroll to enter the system{" "}
          <span className="inline-block animate-bounce">↓</span>
        </span>
        <span>GLVE · v1.0 · White Glove Data Delivery</span>
      </footer>
    </section>
  );
}
