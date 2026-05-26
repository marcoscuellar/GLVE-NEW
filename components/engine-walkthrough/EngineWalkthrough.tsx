"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EngineCard } from "@/components/engine-card";
import type { Engine, EngineState } from "@/components/engine-card/types";

interface Props {
  engines: Engine[];
}

interface ActiveScene {
  engineId: string;
  state: EngineState;
}

const STATE_COPY: Record<
  EngineState,
  { tag: string; headline: React.ReactNode; body: React.ReactNode[] }
> = {
  1: {
    tag: "State 01 · Executive Summary",
    headline: (
      <>
        Clean. Calm. <span className="light">Executive-friendly.</span>
      </>
    ),
    body: [
      "The engine surfaces only what an operator needs to decide whether to invest the next hour: what it does, how it does it, and what it takes in.",
      "A specialized intelligence module inside the Composable Agentic Architecture — a defined mandate, defined boundaries, defined output.",
    ],
  },
  2: {
    tag: "State 02 · Operational Depth",
    headline: (
      <>
        Underneath the executive view.{" "}
        <span className="light">Structured complexity.</span>
      </>
    ),
    body: [
      "No dashboard theatre — only the infrastructure required to make the next commitment defensible.",
    ],
  },
  3: {
    tag: "State 03 · Dual-Output Protocol",
    headline: (
      <>
        Two languages, simultaneously. <span className="light">Audit → handoff.</span>
      </>
    ),
    body: [],
  },
};

function depthDescription(engine: Engine): string {
  if (engine.depth.kind === "terminal")
    return "Each source is queried in parallel — hiring systems, ecosystem feeds, leadership and funding wires. Confidence is raised only when independent sources agree.";
  if (engine.depth.kind === "nodes")
    return "Reporting lines, tenure, and authority signals resolve into a stakeholder map. Visible decision-makers and the quieter authority paths both surface.";
  return "The engine synthesizes everything it has been handed — tone, signal anchor, pain hypothesis, channel preference — into one operational unit per stakeholder.";
}

export function EngineWalkthrough({ engines }: Props) {
  const [active, setActive] = useState<ActiveScene>({
    engineId: engines[0]?.id ?? "01",
    state: 1,
  });
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        let best: { dist: number; target: HTMLElement } | null = null;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const r = e.target.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
          if (!best || dist < best.dist)
            best = { dist, target: e.target as HTMLElement };
        });
        if (!best) return;
        const node = (best as { dist: number; target: HTMLElement }).target;
        const engineId = node.dataset.engine!;
        const state = Number(node.dataset.state) as EngineState;
        setActive({ engineId, state });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [engines]);

  const activeEngine =
    engines.find((e) => e.id === active.engineId) ?? engines[0];
  const activeIdx = engines.findIndex((e) => e.id === active.engineId);

  return (
    <div className="walkthrough" data-screen-label="05 Walkthrough">
      <div className="walkthrough-inner">
        {/* LEFT — sticky canvas */}
        <aside className="canvas-col">
          <div className="canvas">
            <div className="canvas-rail">
              {engines.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  className={cn(
                    "rail-chip",
                    e.tone === "amber" && "amber",
                    e.tone === "navy" && "navy",
                    i < activeIdx && "done",
                    i === activeIdx && "active",
                  )}
                  onClick={() => {
                    const target = document.querySelector<HTMLElement>(
                      `[data-engine="${e.id}"][data-state="1"]`,
                    );
                    target?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <span className="num">{e.id}</span>
                  <span className="name">{e.name}</span>
                </button>
              ))}
            </div>
            {activeEngine && (
              <EngineCard engine={activeEngine} state={active.state} />
            )}
          </div>
        </aside>

        {/* RIGHT — scrolling narrative */}
        <div className="narrative-col">
          {engines.map((engine, i) => {
            const tone = engine.tone;
            const nextEng = engines[i + 1];
            return (
              <section
                key={engine.id}
                className="engine-block"
                data-engine={engine.id}
              >
                <div className="engine-intro">
                  <div className="num">
                    Engine <strong>{engine.id}</strong> · {engine.tag}
                  </div>
                  <h3>{engine.name}</h3>
                  <p className="lede">
                    <strong>{engine.exec.what} </strong>
                    {engine.exec.how}
                  </p>
                </div>

                {([1, 2, 3] as EngineState[]).map((s) => {
                  const refIdx = i * 3 + (s - 1);
                  const copy = STATE_COPY[s];
                  return (
                    <section
                      key={s}
                      className={cn(
                        "state-section",
                        tone === "amber" && "amber",
                        tone === "navy" && "navy",
                      )}
                      data-engine={engine.id}
                      data-state={s}
                      ref={(el) => {
                        sectionRefs.current[refIdx] = el;
                      }}
                    >
                      <div className="tag">
                        <span className="dot" />
                        {copy.tag}
                      </div>
                      <h4>{copy.headline}</h4>
                      {s === 1 && (
                        <>
                          <p>
                            <strong>Input:</strong> {engine.exec.input}
                          </p>
                          {copy.body.map((p, pi) => (
                            <p key={pi}>{p}</p>
                          ))}
                        </>
                      )}
                      {s === 2 && (
                        <>
                          <p>{depthDescription(engine)}</p>
                          {copy.body.map((p, pi) => (
                            <p key={pi}>{p}</p>
                          ))}
                          {engine.depth.kind === "terminal" && (
                            <div className="source-list">
                              {Array.from(
                                new Set(engine.depth.lines.map((l) => l.src)),
                              ).map((s) => (
                                <span key={s}>{s}</span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {s === 3 && (
                        <>
                          <p>
                            <strong>Output 01 · Strategic Audit.</strong>{" "}
                            Human-readable reasoning — sources, verification
                            logic, decision rationale. The trust layer.
                          </p>
                          <p>
                            <strong>Output 02 · System Handoff.</strong> Only
                            the verified variables required downstream.
                            Zero-knowledge — the next engine inherits no messy
                            reasoning, just a clean contract.
                          </p>
                          <p>
                            Downstream:{" "}
                            {engine.handoff.nextId
                              ? `Engine ${engine.handoff.nextId} · ${engine.handoff.nextName}`
                              : engine.handoff.nextName}
                            .
                          </p>
                        </>
                      )}
                    </section>
                  );
                })}

                {nextEng && (
                  <div className="engine-divider">
                    <span className="arrow">→</span>
                    <span className="txt">
                      Handoff · zero-knowledge · {engine.handoff.variables}{" "}
                      verified variables · {nextEng.id} {nextEng.name}
                    </span>
                  </div>
                )}
                {!nextEng && engine.handoff.finalLabel && (
                  <div className="engine-divider">
                    <span className="arrow">→</span>
                    <span className="txt">{engine.handoff.finalLabel}</span>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
