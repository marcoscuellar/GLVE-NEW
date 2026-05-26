"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TerminalLine } from "../types";

interface Props {
  lines: TerminalLine[];
}

export function Terminal({ lines }: Props) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisible((v) => Math.max(v, i + 1)), 80 + i * 90),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return (
    <div className="terminal">
      {lines.map((l, i) => (
        <div
          key={i}
          className={cn("term-line", l.cls, i < visible && "in")}
        >
          <span className="t">{l.t}</span>
          <span className="src">{l.src}</span>
          <span className="msg">{l.msg}</span>
          <span className="v">{l.v}</span>
        </div>
      ))}
    </div>
  );
}
