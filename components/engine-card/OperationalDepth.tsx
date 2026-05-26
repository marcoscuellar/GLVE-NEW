import { DepthHead, SourceStrip, Telemetry } from "./DepthChrome";
import { Terminal } from "./depth/Terminal";
import { Nodes } from "./depth/Nodes";
import { Panels } from "./depth/Panels";
import type { Engine } from "./types";

interface Props {
  engine: Engine;
}

// State 02 · Navy Engine Room — operational depth. The stage container
// flips dark navy (see .stage.state-02 in globals.css); this layer
// renders the engine-specific viz inside it.
export function OperationalDepth({ engine }: Props) {
  const { depth } = engine;
  return (
    <div className="depth-shell">
      <SourceStrip sources={depth.sources} />
      <Telemetry cells={depth.telemetry} />
      <div className="depth-viz">
        {depth.kind === "terminal" && (
          <>
            <DepthHead title={depth.title} meterLabel="Confidence" meterPct={88} />
            <Terminal lines={depth.lines} />
          </>
        )}
        {depth.kind === "nodes" && (
          <>
            <DepthHead title={depth.title} meterLabel="Map" meterPct={92} />
            <Nodes nodes={depth.nodes} edges={depth.edges} legend={depth.legend} />
          </>
        )}
        {depth.kind === "panels" && (
          <>
            <DepthHead title={depth.title} meterLabel="Synth" meterPct={95} />
            <Panels panels={depth.panels} />
          </>
        )}
      </div>
    </div>
  );
}
