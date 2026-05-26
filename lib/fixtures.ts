import type { EngineCardData } from "@/components/engine-card/types";

export const validatorEngine: EngineCardData = {
  id: "validator",
  codename: "VALIDATOR-04",
  name: "ATS Validator Engine",
  summary:
    "Cross-checks every inbound role against the direct ATS, staffing-firm registry, and recency window before it can advance to outreach.",
  metrics: [
    { label: "Throughput", value: "1,284 / hr", delta: "+12.4%", level: "green" },
    { label: "Validation rate", value: "91.7%", delta: "+1.2pp", level: "green" },
    { label: "Avg latency", value: "342 ms", delta: "−18 ms", level: "green" },
    { label: "Agency rejects", value: "37", level: "amber" },
    { label: "ATS misses", value: "4", level: "red" },
    { label: "Cache hit", value: "78%", level: "green" },
  ],
  pipeline: [
    { id: "ingest", name: "Ingest raw posting", status: "complete", durationMs: 42 },
    { id: "normalize", name: "Normalize fields", status: "complete", durationMs: 58 },
    { id: "ats", name: "Resolve direct ATS", status: "complete", durationMs: 121 },
    { id: "agency", name: "Agency / staffing check", status: "active", durationMs: 96 },
    { id: "score", name: "Signal score", status: "queued" },
    { id: "emit", name: "Emit to War Room", status: "queued" },
  ],
  logs: [
    {
      ts: "00:04:12.041",
      channel: "ats.resolve",
      body: "matched greenhouse.io/keeper-security → role_id=8421",
      level: "green",
    },
    {
      ts: "00:04:12.187",
      channel: "agency.check",
      body: "no staffing-firm overlap in 30d window",
      level: "green",
    },
    {
      ts: "00:04:12.244",
      channel: "signal.recency",
      body: "posted 27d ago · within hot threshold",
      level: "green",
    },
    {
      ts: "00:04:12.310",
      channel: "agency.check",
      body: "duplicate detected → robert-half/aerotek",
      level: "amber",
    },
    {
      ts: "00:04:12.401",
      channel: "ats.resolve",
      body: "lever.co/runpod → role_id=2210",
      level: "green",
    },
    {
      ts: "00:04:12.522",
      channel: "scoring.fanout",
      body: "scoring queue depth=4 · workers=3",
    },
    {
      ts: "00:04:12.608",
      channel: "ats.resolve",
      body: "no direct ATS resolved · holding for retry",
      level: "red",
    },
    {
      ts: "00:04:12.701",
      channel: "agency.check",
      body: "no staffing-firm overlap in 30d window",
      level: "green",
    },
  ],
  output: {
    primary: {
      title: "Qualified for War Room",
      body: "Keeper Security · Information Security Engineer · Score 89 · Hot 27d · No agency overlap.",
    },
    secondary: {
      title: "Returned to queue",
      body: "1 posting failed direct-ATS resolution and was pushed to the retry shelf with a 6h cooldown.",
    },
  },
};
