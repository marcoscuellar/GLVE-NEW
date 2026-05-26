"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { PanelSpec } from "../types";

interface Props {
  panels: PanelSpec[];
}

export function Panels({ panels }: Props) {
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    setVisible(new Set());
    const timers: ReturnType<typeof setTimeout>[] = [];
    panels.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setVisible((s) => new Set(s).add(i)),
          80 + i * 120,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [panels]);

  return (
    <div className="panels">
      {panels.map((p, i) => (
        <div
          key={p.lbl}
          className={cn("panel", visible.has(i) && "in")}
          style={{
            // @ts-expect-error custom property
            "--d": `${i * 120}ms`,
          }}
        >
          <div className="ph">
            <span className="lbl">{p.lbl}</span>
            <span className="stat">{p.stat}</span>
          </div>
          <div className="body">
            {p.rows.map(([k, v], ri) => (
              <div key={ri} className="row">
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
