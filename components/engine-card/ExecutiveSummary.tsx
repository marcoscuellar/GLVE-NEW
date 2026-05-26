import type { Engine } from "./types";

interface Props {
  engine: Engine;
}

export function ExecutiveSummary({ engine }: Props) {
  return (
    <div className="exec">
      <div className="exec-tag">— Executive Summary</div>
      <div className="exec-title">
        Engine {engine.id} · {engine.name}
      </div>
      <div className="exec-grid">
        <div className="exec-row">
          <div className="k">What</div>
          <div className="v">{engine.exec.what}</div>
        </div>
        <div className="exec-row">
          <div className="k">How</div>
          <div className="v">{engine.exec.how}</div>
        </div>
        <div className="exec-row">
          <div className="k">Input</div>
          <div className="v">{engine.exec.input}</div>
        </div>
      </div>
      <div className="exec-foot">
        <div className="handoff">
          <span className="arrow">↓</span>
          <span>
            {engine.handoff.nextId
              ? `Hands off ${engine.handoff.variables} verified variables to Engine ${engine.handoff.nextId} · ${engine.handoff.nextName}`
              : engine.handoff.nextName}
          </span>
        </div>
      </div>
    </div>
  );
}
