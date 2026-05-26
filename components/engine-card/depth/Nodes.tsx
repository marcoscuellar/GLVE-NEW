"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { NodeSpec } from "../types";

interface Props {
  nodes: NodeSpec[];
  edges: Array<[number, number]>;
  legend?: [string, string];
}

interface Resolved {
  cx: number;
  cy: number;
}

export function Nodes({ nodes, edges, legend }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [activeEdges, setActiveEdges] = useState<Set<number>>(new Set());

  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(() => {
      const r = stageRef.current!.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(stageRef.current);
    const r = stageRef.current.getBoundingClientRect();
    setSize({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setActiveNodes(new Set());
    setActiveEdges(new Set());
    const timers: ReturnType<typeof setTimeout>[] = [];
    nodes.forEach((n, i) => {
      timers.push(
        setTimeout(
          () => setActiveNodes((s) => new Set(s).add(i)),
          n.d ?? 0,
        ),
      );
    });
    edges.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setActiveEdges((s) => new Set(s).add(i)),
          200 + i * 90,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [nodes, edges]);

  const placed: Resolved[] = nodes.map((n) => ({
    cx: (n.x * size.w) / 100,
    cy: (n.y * size.h) / 100,
  }));

  return (
    <div className="nodes" ref={stageRef}>
      <svg viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} preserveAspectRatio="none">
        {edges.map(([a, b], i) => {
          const A = placed[a];
          const B = placed[b];
          if (!A || !B) return null;
          const mx = (A.cx + B.cx) / 2;
          const my = (A.cy + B.cy) / 2 - 24;
          return (
            <path
              key={i}
              className={cn("node-line", activeEdges.has(i) && "in")}
              d={`M${A.cx},${A.cy} Q${mx},${my} ${B.cx},${B.cy}`}
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <div
          key={i}
          className={cn("node", n.lead && "lead", activeNodes.has(i) && "in")}
          style={{
            left: placed[i].cx,
            top: placed[i].cy,
            // @ts-expect-error custom property
            "--d": `${n.d ?? 0}ms`,
          }}
        >
          <div className="dot" />
          <div className="lbl">{n.lbl}</div>
          {n.role && <div className="role">{n.role}</div>}
        </div>
      ))}
      {legend && (
        <div className="nodes-legend">
          <span>
            <i className="solid" />
            {legend[0]}
          </span>
          <span>
            <i />
            {legend[1]}
          </span>
        </div>
      )}
    </div>
  );
}
