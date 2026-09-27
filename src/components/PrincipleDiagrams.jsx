import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Tiny SMIL diagrams for the About principles. Each one animates the idea,
// and is paused (pauseAnimations) whenever its card isn't active.

const BORDER = "#e2e8f0";
const TEXT = { fontFamily: "JetBrains Mono, monospace", fontSize: 8.5, fontWeight: 600, fill: "#334155" };

function Box({ x, y, w = 62, h = 22, label, children }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="6" fill="#fff" stroke={BORDER}>
        {children}
      </rect>
      <text x={x} y={y + 3} textAnchor="middle" {...TEXT}>
        {label}
      </text>
    </g>
  );
}

function useSvgPlayback(active) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const svg = ref.current;
    if (!svg?.pauseAnimations) return;
    if (active && !reduced) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active, reduced]);
  return ref;
}

/** Design for change: B ships a new version; A and C keep running untouched. */
export function ChangeDiagram({ active, color }) {
  const ref = useSvgPlayback(active);
  return (
    <svg ref={ref} viewBox="0 0 240 78" className="h-full w-full" aria-hidden="true">
      <path d="M71 20 H139" stroke={BORDER} strokeWidth="1.3" markerEnd="url(#arrow-a)" />
      <path d="M170 31 V47" stroke={BORDER} strokeWidth="1.3" />
      <defs>
        <marker id="arrow-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#cbd5e1" />
        </marker>
      </defs>
      <Box x={40} y={20} label="Service A" />
      <Box x={170} y={20} label="Service B">
        <animate attributeName="stroke" values={`${BORDER};${BORDER};${color};${color};${BORDER}`} keyTimes="0;0.35;0.45;0.8;1" dur="3.6s" repeatCount="indefinite" />
      </Box>
      <Box x={170} y={58} label="Service C" />
      {/* version tag flips v1 → v2 on B only */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="7" fontWeight="700">
        <text x={206} y={9} fill="#94a3b8">
          v1
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.38;0.42;0.96;1" dur="3.6s" repeatCount="indefinite" />
        </text>
        <text x={206} y={9} fill={color} opacity="0">
          v2
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.38;0.42;0.96;1" dur="3.6s" repeatCount="indefinite" />
        </text>
      </g>
      {/* A and C stay healthy the whole time */}
      <circle cx={66} cy={12} r="2.4" fill="#10b981" />
      <circle cx={196} cy={50} r="2.4" fill="#10b981" />
      <circle cx={196} cy={12} r="2.4" fill="#10b981">
        <animate attributeName="fill" values={`#10b981;#10b981;${color};#10b981;#10b981`} keyTimes="0;0.35;0.42;0.6;1" dur="3.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/** Build for reliability: a failed hand-off goes to a retry queue, then succeeds. */
export function RetryDiagram({ active, color }) {
  const ref = useSvgPlayback(active);
  const path = "M26 20 L112 20 L176 20 L112 20 L150 58 L208 20";
  return (
    <svg ref={ref} viewBox="0 0 240 78" className="h-full w-full" aria-hidden="true">
      <path d="M26 20 H208 M112 20 L150 58 L208 20" fill="none" stroke={BORDER} strokeWidth="1.3" strokeDasharray="0" />
      <Box x={26} y={20} w={44} label="Req" />
      <Box x={112} y={20} w={56} label="Gateway" />
      <Box x={208} y={20} w={56} label="Service">
        <animate
          attributeName="stroke"
          values={`${BORDER};${BORDER};#f59e0b;${BORDER};${BORDER};#10b981;#10b981;${BORDER}`}
          keyTimes="0;0.28;0.3;0.4;0.84;0.86;0.98;1"
          dur="4.6s"
          repeatCount="indefinite"
        />
      </Box>
      <Box x={150} y={60} w={72} h={20} label="Retry Queue">
        <animate attributeName="stroke" values={`${BORDER};${BORDER};${color};${color};${BORDER};${BORDER}`} keyTimes="0;0.53;0.56;0.72;0.76;1" dur="4.6s" repeatCount="indefinite" />
      </Box>
      <circle r="3.6" fill={color}>
        <animateMotion
          path={path}
          dur="4.6s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;0.18;0.3;0.4;0.55;0.72;0.85;1"
          keyPoints="0;0.27;0.45;0.63;0.83;0.83;1;1"
        />
      </circle>
    </svg>
  );
}

/** Keep systems understandable: one request passing through clear layers. */
export function LayersDiagram({ active, color }) {
  const ref = useSvgPlayback(active);
  const layers = [
    { x: 38, label: "API", sub: "controller", t: 0.12 },
    { x: 120, label: "Service", sub: "business logic", t: 0.42 },
    { x: 202, label: "Repository", sub: "data access", t: 0.72 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 240 78" className="h-full w-full" aria-hidden="true">
      <path d="M38 26 H202" stroke={BORDER} strokeWidth="1.3" />
      {layers.map((l) => (
        <g key={l.label}>
          <Box x={l.x} y={26} w={l.label === "Repository" ? 68 : 58} label={l.label}>
            <animate
              attributeName="stroke"
              values={`${BORDER};${BORDER};${color};${color};${BORDER};${BORDER}`}
              keyTimes={`0;${l.t};${l.t + 0.03};${l.t + 0.18};${l.t + 0.22};1`}
              dur="3.4s"
              repeatCount="indefinite"
            />
          </Box>
          <text x={l.x} y={54} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#94a3b8">
            {l.sub}
          </text>
        </g>
      ))}
      <circle r="3.4" fill={color} cy="0">
        <animateMotion path="M20 26 H222" dur="3.4s" repeatCount="indefinite" keyTimes="0;0.9;1" keyPoints="0;1;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.85;0.9;1" dur="3.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
