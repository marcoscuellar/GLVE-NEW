export type EngineState = "executive-summary" | "navy-engine-room" | "dual-output";

export type SignalLevel = "green" | "amber" | "red";

export interface EngineMetric {
  label: string;
  value: string;
  delta?: string;
  level?: SignalLevel;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: "complete" | "active" | "queued";
  durationMs?: number;
}

export interface LogLine {
  ts: string;
  channel: string;
  body: string;
  level?: SignalLevel;
}

export interface EngineCardData {
  id: string;
  name: string;
  codename: string;
  summary: string;
  metrics: EngineMetric[];
  pipeline: PipelineStage[];
  logs: LogLine[];
  output?: {
    primary: { title: string; body: string };
    secondary: { title: string; body: string };
  };
}
