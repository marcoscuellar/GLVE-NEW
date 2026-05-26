import { cn } from "@/lib/cn";

interface BarRow {
  label: string;
  pct: number;
  value: string;
  critical?: boolean;
}

export function StuckCard() {
  const rows: BarRow[] = [
    { label: "01 → 02", pct: 8, value: "8%" },
    { label: "02 → 03", pct: 14, value: "14%" },
    { label: "03 → 04", pct: 31, value: "31%", critical: true },
    { label: "04 → 05", pct: 11, value: "11%" },
    { label: "05 → 06", pct: 6, value: "6%" },
  ];
  return (
    <article className="vis-mini vis-stuck">
      <header>
        <div className="vc-lbl">[ Where reps get stuck ]</div>
        <div className="vc-meta">Handoff · 7d</div>
      </header>
      <div className="vm-stat">
        <div className="vm-num">
          31<span className="vm-unit">%</span>
        </div>
        <div className="vm-cap">
          stall at{" "}
          <strong>
            03&nbsp;→&nbsp;04
          </strong>
          <br />
          handoff timeout
        </div>
      </div>
      <div className="vm-rows">
        {rows.map((r) => (
          <div
            key={r.label}
            className={cn("vc-row", r.critical && "critical")}
          >
            <span className="vc-k">{r.label}</span>
            <div className="vc-bar">
              <i style={{ width: `${r.pct}%` }} />
            </div>
            <span className="vc-v">{r.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

interface SignalRow {
  label: string;
  bars: number;
  value: string;
  dim?: boolean;
}

export function SignalQualityCard() {
  const rows: SignalRow[] = [
    { label: "Greenhouse", bars: 5, value: "98%" },
    { label: "Workday", bars: 4, value: "94%" },
    { label: "Lever", bars: 3, value: "76%" },
    { label: "Indeed", bars: 2, value: "42%", dim: true },
  ];
  return (
    <article className="vis-mini vis-signal">
      <header>
        <div className="vc-lbl">[ Signal quality ]</div>
        <div className="vc-meta">Verified · 30d</div>
      </header>
      <div className="vm-stat">
        <div className="vm-num vm-num-ok">
          94<span className="vm-unit">%</span>
        </div>
        <div className="vm-cap">
          weighted source
          <br />
          confidence
        </div>
      </div>
      <div className="vm-rows">
        {rows.map((r) => (
          <div key={r.label} className={cn("vc-row", r.dim && "dim")}>
            <span className="vc-k">{r.label}</span>
            <span className="vc-conf">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={i < r.bars ? "on" : ""} />
              ))}
            </span>
            <span className="vc-v">{r.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

interface CoachRow {
  rep: string;
  mode: string;
  engines: string[];
  critical?: boolean;
}

export function CoachingCard() {
  const rows: CoachRow[] = [
    { rep: "Rep A", mode: "04 only", engines: ["04"] },
    { rep: "Rep B", mode: "04 + 02", engines: ["04", "02"] },
    {
      rep: "Rep C",
      mode: "stuck at 03",
      engines: ["01", "02", "03"],
      critical: true,
    },
    {
      rep: "Rep D",
      mode: "full loop · clean",
      engines: ["01", "02", "03", "04", "05", "06"],
    },
    {
      rep: "Rep E",
      mode: "full loop · clean",
      engines: ["01", "02", "03", "04", "05", "06"],
    },
  ];
  return (
    <article className="vis-mini vis-coach">
      <header>
        <div className="vc-lbl">[ Coaching surface · by rep ]</div>
        <div className="vc-meta">Audit · 7d</div>
      </header>
      <div className="vm-stat">
        <div className="vm-num vm-num-warn">
          1<span className="vm-unit">/5</span>
        </div>
        <div className="vm-cap">
          rep flagged
          <br />
          at 03 handoff
        </div>
      </div>
      <div className="vm-rows">
        {rows.map((r) => (
          <div
            key={r.rep}
            className={cn("coach-row", r.critical && "critical")}
          >
            <span className="coach-rep">{r.rep}</span>
            <span className="coach-mode">{r.mode}</span>
            <span className="coach-eng">
              {r.engines.map((e) => (
                <b key={e}>{e}</b>
              ))}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
