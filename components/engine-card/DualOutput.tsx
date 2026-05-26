import { cn } from "@/lib/cn";
import type { AuditBlock, Engine, HandoffBlock } from "./types";

interface Props {
  engine: Engine;
}

function ConfBars({ token }: { token: string }) {
  const m = /^conf:(\d)/.exec(token);
  if (!m) return <span className="muted">{token}</span>;
  const n = parseInt(m[1], 10);
  return (
    <span className="conf">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < n ? "on" : ""} />
      ))}
    </span>
  );
}

function StatusTag({ token }: { token: string }) {
  const lower = token.toLowerCase();
  if (lower === "ok") return <span className="tag-mini ok">✓ OK</span>;
  if (lower === "sent") return <span className="tag-mini ok">✓ SENT</span>;
  if (lower === "live") return <span className="tag-mini amb">● LIVE</span>;
  if (lower === "hold") return <span className="tag-mini amb">◌ HOLD</span>;
  if (lower === "reroute") return <span className="tag-mini">⤳ REROUTE</span>;
  return <span className="tag-mini">{token}</span>;
}

function AuditTable({ audit }: { audit: AuditBlock }) {
  return (
    <div className="tbl">
      <div
        className="tbl-row head"
        style={{ gridTemplateColumns: audit.cols }}
      >
        {audit.head.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>
      {audit.rows.map((row, ri) => (
        <div
          key={ri}
          className="tbl-row"
          style={{ gridTemplateColumns: audit.cols }}
        >
          {row.map((cell, ci) => {
            if (/^conf:\d/.test(cell))
              return (
                <div key={ci}>
                  <ConfBars token={cell} />
                </div>
              );
            if (/^(ok|sent|live|hold|reroute)$/i.test(cell))
              return (
                <div key={ci}>
                  <StatusTag token={cell} />
                </div>
              );
            return (
              <div key={ci} className={ci === 0 ? "cmp" : "muted"}>
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function JsonValue({
  value,
}: {
  value: string | number | boolean | null | Array<string | number>;
}) {
  if (value === null) return <span className="null">null</span>;
  if (typeof value === "number")
    return <span className="num">{String(value)}</span>;
  if (typeof value === "boolean")
    return <span className="bool">{String(value)}</span>;
  if (Array.isArray(value)) {
    return (
      <span>
        <span className="punct">[</span>
        {value.map((item, i) => (
          <span key={i}>
            <JsonValue value={item} />
            {i < value.length - 1 && <span className="punct">, </span>}
          </span>
        ))}
        <span className="punct">]</span>
      </span>
    );
  }
  return (
    <span>
      <span className="punct">{'"'}</span>
      <span className="str">{String(value)}</span>
      <span className="punct">{'"'}</span>
    </span>
  );
}

function HandoffBlockView({ handoff }: { handoff: HandoffBlock }) {
  const keys = Object.keys(handoff.json);
  return (
    <div className="handoff-block">
      <div className="tag-line">&lt;SYSTEM_HANDOFF&gt;</div>
      <div className="punct">{"{"}</div>
      {keys.map((k, i) => (
        <div key={k} className="kv">
          <span className="punct">{'"'}</span>
          <span className="key">{k}</span>
          <span className="punct">{'": '}</span>
          <JsonValue value={handoff.json[k]} />
          {i < keys.length - 1 && <span className="punct">,</span>}
        </div>
      ))}
      <div className="punct">{"}"}</div>
      <div className="tag-line">&lt;/SYSTEM_HANDOFF&gt;</div>
    </div>
  );
}

export function DualOutput({ engine }: Props) {
  const { audit, handoff } = engine;
  const nextLabel = handoff.nextId
    ? `Engine ${handoff.nextId} · ${handoff.nextName}`
    : handoff.nextName;

  return (
    <div className="dual">
      <div className={cn("dual-section", "reveal")}>
        <div className="dual-tag">
          <span className="badge audit">Output 01 · Strategic Audit</span>
          Human-readable intelligence
        </div>
        <div className="audit-head">
          <span className="ttl">{engine.name} · verified output</span>
          <span className="meta">{audit.meta}</span>
        </div>
        <div className="audit-summary">{audit.summary}</div>
        <AuditTable audit={audit} />
      </div>

      <div className="compress">
        <span className="rule" />
        <span className="pill">Compression · audit → handoff</span>
        <span className="rule" />
      </div>

      <div className={cn("dual-section", "reveal", "delayed")}>
        <div className="dual-tag">
          <span className="badge handoff">Output 02 · System Handoff</span>
          Machine-readable orchestration
        </div>
        <HandoffBlockView handoff={handoff} />
        <div className="handoff-foot">
          <span>
            Zero-knowledge · {handoff.variables} verified variables
          </span>
          <span className="next-pill">
            <span className="arrow">→</span>
            <span>{nextLabel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
