export type EngineState = 1 | 2 | 3;
export type EngineTone = "default" | "amber" | "navy";

export interface ExecBlock {
  what: string;
  how: string;
  input: string;
}

export interface DepthSource {
  code: string;
  name: string;
  live?: boolean;
  more?: boolean;
}

export interface DepthTelemetryCell {
  k: string;
  v: string;
  live?: boolean;
}

export interface TerminalLine {
  t: string;
  src: string;
  msg: string;
  v: string;
  cls?: "ok" | "flag" | "dup";
}

export interface NodeSpec {
  x: number;
  y: number;
  lbl: string;
  role?: string;
  lead?: boolean;
  d?: number;
}

export interface PanelSpec {
  lbl: string;
  stat: string;
  rows: Array<[string, string]>;
}

export type DepthBlock =
  | {
      kind: "terminal";
      title: string;
      sources: DepthSource[];
      telemetry: DepthTelemetryCell[];
      lines: TerminalLine[];
    }
  | {
      kind: "nodes";
      title: string;
      sources: DepthSource[];
      telemetry: DepthTelemetryCell[];
      legend?: [string, string];
      nodes: NodeSpec[];
      edges: Array<[number, number]>;
    }
  | {
      kind: "panels";
      title: string;
      sources: DepthSource[];
      telemetry: DepthTelemetryCell[];
      panels: PanelSpec[];
    };

export type AuditCellToken = string;

export interface AuditBlock {
  summary: string;
  meta: string;
  cols: string;
  head: string[];
  rows: AuditCellToken[][];
}

export interface HandoffBlock {
  nextId: string | null;
  nextName: string;
  variables: number;
  json: Record<string, string | number | boolean | null | Array<string | number>>;
  finalLabel?: string;
}

export interface Engine {
  id: string;
  name: string;
  tone: EngineTone;
  tag: string;
  exec: ExecBlock;
  depth: DepthBlock;
  audit: AuditBlock;
  handoff: HandoffBlock;
}
