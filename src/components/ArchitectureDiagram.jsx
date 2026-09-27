import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, KeyRound, Route, Settings2, User, Activity, Bot, Radar, MessageSquareText, Database, Sparkles, MousePointerClick, ArrowDown, X, Network, Waypoints } from "lucide-react";
import { SYSTEM_NODES, SYSTEM_EDGES, TRACE_PATH } from "../data/architecture";
import { CATEGORY_COLORS } from "../data/categoryColors";
import { useSequence } from "../hooks/useSequence";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { PACKET, SPRING } from "../lib/motion";

const ICONS = {
  client: Globe,
  keycloak: KeyRound,
  gateway: Route,
  "config-server": Settings2,
  "user-service": User,
  "activity-service": Activity,
  "ai-service": Bot,
  eureka: Radar,
  rabbitmq: MessageSquareText,
  postgresql: Database,
  gemini: Sparkles,
};

const CATEGORY_LABELS = { security: "Security", edge: "Gateway", service: "Service", messaging: "Messaging", data: "Database", ai: "AI", platform: "Platform" };

// Two layouts over the same diagram engine. Desktop uses the coordinates in
// data/architecture.js; phones get their own portrait layout (not a scaled-down
// desktop) with node widths expressed as a share of the canvas, so nodes can
// never overlap at any phone width.
const DESKTOP = {
  width: 800,
  height: 500,
  bands: [
    { y: 84, h: 92, label: "EDGE · SECURITY · CONFIG" },
    { y: 226, h: 92, label: "SERVICES" },
    { y: 378, h: 92, label: "DATA · MESSAGING · AI · DISCOVERY" },
  ],
  pos: Object.fromEntries(SYSTEM_NODES.map((n) => [n.id, { x: n.x, y: n.y }])),
};
const MOBILE = {
  width: 360,
  height: 430,
  bands: [
    { y: 70, h: 80, label: "EDGE · SECURITY · CONFIG" },
    { y: 186, h: 80, label: "SERVICES" },
    { y: 304, h: 90, label: "DATA · MESSAGING · AI" },
  ],
  pos: {
    client: { x: 180, y: 28 },
    keycloak: { x: 62, y: 110 },
    gateway: { x: 180, y: 110 },
    "config-server": { x: 298, y: 110 },
    "user-service": { x: 62, y: 226 },
    "activity-service": { x: 180, y: 226 },
    "ai-service": { x: 298, y: 226 },
    eureka: { x: 46, y: 349 },
    postgresql: { x: 136, y: 349 },
    rabbitmq: { x: 224, y: 349 },
    gemini: { x: 314, y: 349 },
  },
  // node width in canvas units, by row
  nodeWidth: (y) => (y > 300 ? 82 : 104),
  // shorter labels where a narrow node would otherwise break a word mid-way
  shortLabel: { postgresql: "Postgres" },
};

const edgeKey = (a, b) => `${a}->${b}`;
const pct = (v, total) => `${(v / total) * 100}%`;
const nodesById = Object.fromEntries(SYSTEM_NODES.map((n) => [n.id, n]));
const hopEdgeKey = (h) => (h.reverse ? edgeKey(h.to, h.from) : edgeKey(h.from, h.to));
const TRACE_EDGES = new Set(TRACE_PATH.map(hopEdgeKey));
const TRACE_NODES = new Set(TRACE_PATH.flatMap((h) => [h.from, h.to]));

function edgePath(a, b) {
  if (Math.abs(a.y - b.y) < 1) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const midY = (a.y + b.y) / 2;
  return `M${a.x} ${a.y} C${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
}

// SMIL packet that starts the moment it mounts, so it always leaves from the start of its edge.
function Packet({ d, color, dur = 1.1, repeat = false, reverse = false }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    ref.current?.querySelectorAll("animateMotion").forEach((anim) => anim.beginElement?.());
  }, []);
  const motionProps = {
    dur: `${dur}s`,
    begin: "indefinite",
    fill: "freeze",
    repeatCount: repeat ? "indefinite" : "1",
    path: d,
    ...(reverse ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" } : {}),
  };
  return (
    <g ref={ref}>
      <circle r="9" fill={color} opacity="0.16">
        <animateMotion {...motionProps} />
      </circle>
      <circle r="3.8" fill={color}>
        <animateMotion {...motionProps} />
      </circle>
    </g>
  );
}

function ViewToggle({ view, onChange }) {
  const options = [
    { key: "system", label: "System view", icon: Network },
    { key: "trace", label: "Trace view", icon: Waypoints },
  ];
  return (
    <div role="tablist" aria-label="Diagram view" className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
      {options.map(({ key, label, icon: Icon }) => {
        const active = view === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`relative flex h-8 items-center gap-1.5 rounded-lg px-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 ${
              active ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
            }`}
          >
            {active && <motion.span layoutId="arch-view-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-[var(--color-border)]" transition={SPRING.soft} />}
            <Icon className="relative h-3.5 w-3.5" aria-hidden="true" />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function InspectPanel({ node, neighbours, onClose }) {
  const colors = CATEGORY_COLORS[node.category];
  const Icon = ICONS[node.id];
  return (
    <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${colors.bg}`}>
          <Icon className={`h-3.5 w-3.5 ${colors.text}`} aria-hidden="true" />
        </span>
        <p className="text-base font-semibold tracking-tight text-[var(--color-text)]">{node.label}</p>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${colors.bg} ${colors.text}`}>{CATEGORY_LABELS[node.category]}</span>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Clear selection" className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-faint)] transition-colors hover:bg-white hover:text-[var(--color-text)]">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-6">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Role</p>
          <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{node.role}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Why</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{node.why}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Flow</p>
          <ol className="mt-1.5 flex flex-col items-start">
            {node.flow.map((f, i) => (
              <li key={f} className="flex flex-col items-start">
                <span className={`rounded-md border px-2 py-0.5 font-mono text-[10.5px] ${f === node.label ? `${colors.border} ${colors.bg} ${colors.text} font-semibold` : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"}`}>{f}</span>
                {i < node.flow.length - 1 && <ArrowDown className="my-0.5 ml-2 h-3 w-3 text-[var(--color-text-faint)]" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {neighbours.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[var(--color-border-soft)] pt-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Connects to</span>
          {neighbours.map((n) => (
            <span key={n.id} className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-white px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[n.category].dot }} />
              {n.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ArchitectureDiagram() {
  const reduced = usePrefersReducedMotion();
  const isPhone = useMediaQuery("(max-width: 639px)");
  const L = isPhone ? MOBILE : DESKTOP;
  const P = (id) => L.pos[id];
  const [view, setView] = useState("system");
  const [pinned, setPinned] = useState(null);
  const [hover, setHover] = useState(null);
  const { ref, step } = useSequence(TRACE_PATH.length, { interval: 1500, rest: 1, enabled: view === "trace" });

  const inspectedId = view === "system" ? pinned ?? hover : null;
  const inspected = inspectedId ? nodesById[inspectedId] : null;
  const hop = view === "trace" && step >= 0 ? TRACE_PATH[step] : null;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPinned(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const connected = useMemo(() => {
    if (!inspectedId) return null;
    const ids = new Set([inspectedId]);
    const edges = new Set();
    SYSTEM_EDGES.forEach((e) => {
      if (e.from === inspectedId || e.to === inspectedId) {
        ids.add(e.from);
        ids.add(e.to);
        edges.add(edgeKey(e.from, e.to));
      }
    });
    return { ids, edges };
  }, [inspectedId]);

  const neighbours = connected ? [...connected.ids].filter((id) => id !== inspectedId).map((id) => nodesById[id]) : [];

  const selectNode = (id) => {
    if (view === "trace") setView("system");
    setPinned((cur) => (cur === id ? null : id));
  };

  const nodeFocus = (id) => {
    if (view === "trace") return TRACE_NODES.has(id) ? (hop && (hop.to === id || hop.from === id) ? "lit" : "path") : "dim";
    if (!connected) return "normal";
    if (id === inspectedId) return "selected";
    return connected.ids.has(id) ? "lit" : "dim";
  };

  const changeView = (v) => {
    setView(v);
    setPinned(null);
    setHover(null);
  };

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ViewToggle view={view} onChange={changeView} />
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
          {view === "trace" ? "One complete request · looped" : "Click any component to inspect it"}
        </p>
      </div>

      {/* Tablet / desktop canvas */}
      <div className="relative w-full select-none" style={{ aspectRatio: `${L.width} / ${L.height}` }} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${L.width} ${L.height}`} className="absolute inset-0 h-full w-full" aria-hidden="true" onClick={() => setPinned(null)}>
          <defs>
            <pattern id="arch-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="#e2e8f0" />
            </pattern>
          </defs>
          <rect width={L.width} height={L.height} fill="url(#arch-dots)" />
          {L.bands.map((band) => (
            <g key={band.label}>
              <rect x="4" y={band.y} width={L.width - 8} height={band.h} rx={isPhone ? 10 : 14} fill="#f8fafc" opacity="0.85" stroke="#eef1f6" />
              <text x="16" y={band.y + 14} className="hidden lg:block" fontSize="8" letterSpacing="1.4" fontFamily="JetBrains Mono, monospace" fill="#94a3b8">
                {band.label}
              </text>
            </g>
          ))}

          {SYSTEM_EDGES.map((edge) => {
            const a = P(edge.from);
            const b = P(edge.to);
            const key = edgeKey(edge.from, edge.to);
            const d = edgePath(a, b);
            const color = CATEGORY_COLORS[nodesById[edge.from].category]?.dot ?? "#6366f1";
            const isDiscovery = edge.kind === "discovery" || edge.kind === "config";
            let stroke = "#d5dae4";
            let width = 1.3;
            let opacity = isDiscovery ? 0.7 : 1;
            let flowing = false;

            if (view === "system" && connected) {
              if (connected.edges.has(key)) {
                stroke = color;
                width = 2;
                opacity = 1;
                flowing = true;
              } else opacity = 0.14;
            }
            if (view === "trace") {
              const onPath = TRACE_EDGES.has(key);
              const isHop = hop && hopEdgeKey(hop) === key;
              stroke = isHop ? PACKET[hop.kind].color : onPath ? "#c7d2fe" : "#d5dae4";
              width = isHop ? 2.2 : onPath ? 1.6 : 1.1;
              opacity = onPath ? 1 : 0.14;
            }

            return (
              <g key={key}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={width}
                  strokeDasharray={isDiscovery && stroke === "#d5dae4" ? "3 5" : undefined}
                  strokeLinecap="round"
                  opacity={opacity}
                  className={flowing && !reduced ? "flow-line" : ""}
                  style={{ transition: "opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease" }}
                />
                {flowing && !reduced && <Packet d={d} color={color} dur={1.5} repeat />}
              </g>
            );
          })}

          {hop && !reduced && (
            <Packet
              key={`trace-${step}`}
              d={edgePath(P(hop.reverse ? hop.to : hop.from), P(hop.reverse ? hop.from : hop.to))}
              color={PACKET[hop.kind].color}
              dur={1}
              reverse={hop.reverse}
            />
          )}
        </svg>

        {SYSTEM_NODES.map((node) => {
          const Icon = ICONS[node.id];
          const colors = CATEGORY_COLORS[node.category];
          const focus = nodeFocus(node.id);
          const isSelected = focus === "selected";
          const isLit = focus === "lit" || isSelected;
          const isDim = focus === "dim";
          const isPinned = pinned === node.id;
          const isClient = node.id === "client";
          const at = P(node.id);
          const tooltipBelow = at.y < 180;
          const arriving = hop && hop.to === node.id;
          return (
            <motion.button
              key={node.id}
              type="button"
              data-cursor="ring"
              onMouseEnter={() => view === "system" && setHover(node.id)}
              onFocus={() => view === "system" && setHover(node.id)}
              onBlur={() => setHover(null)}
              onClick={() => selectNode(node.id)}
              aria-pressed={isPinned}
              aria-label={`${node.label} — ${node.role}. ${node.why}`}
              animate={{ opacity: isDim ? 0.28 : 1, scale: isSelected ? 1.07 : isLit ? 1.02 : 1 }}
              transition={{ opacity: { duration: 0.3 }, scale: SPRING.micro }}
              style={{ left: pct(at.x, L.width), top: pct(at.y, L.height), width: isPhone && !isClient ? pct(MOBILE.nodeWidth(at.y), L.width) : undefined, zIndex: isSelected ? 20 : 2, x: "-50%", y: "-50%" }}
              className={`absolute flex items-center border bg-white text-center transition-[border-color,box-shadow] duration-300 ${
                isClient ? "gap-1.5 rounded-full px-3 py-1.5" : isPhone ? "flex-col gap-0.5 rounded-lg px-1 py-1.5" : "w-[96px] flex-col gap-1 rounded-xl px-2 py-2 md:w-[112px] lg:w-[124px] lg:py-2.5"
              } ${isLit || arriving ? `${colors.border} shadow-lg ${colors.ring}` : "border-[var(--color-border)] shadow-[0_2px_8px_-4px_rgba(15,23,42,0.12)]"} ${isPinned ? "ring-2 ring-indigo-200 ring-offset-2" : ""}`}
            >
              {arriving && !reduced && (
                <motion.span
                  key={`arr-${step}`}
                  className="pointer-events-none absolute -inset-1 rounded-[inherit]"
                  style={{ boxShadow: `0 0 0 2px ${PACKET[hop.kind].color}55, 0 0 24px ${PACKET[hop.kind].color}44` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.3] }}
                  transition={{ delay: 0.85, duration: 0.6 }}
                />
              )}
              <span className={`flex items-center justify-center rounded-lg ${colors.bg} ${isClient || isPhone ? "h-5 w-5" : "h-7 w-7"}`}>
                <Icon className={`h-3.5 w-3.5 ${colors.text}`} aria-hidden="true" />
              </span>
              <span className={`font-mono font-semibold leading-tight text-[var(--color-text)] ${isPhone ? "text-[10px]" : "whitespace-nowrap text-[10px] lg:text-[11px]"}`}>{isPhone ? MOBILE.shortLabel[node.id] ?? node.label : node.label}</span>
              {!isClient && <span className={`hidden font-mono text-[8px] uppercase tracking-wider md:block ${colors.text}`}>{CATEGORY_LABELS[node.category]}</span>}

              <AnimatePresence>
                {view === "system" && hover === node.id && !pinned && (
                  <motion.span
                    initial={{ opacity: 0, y: tooltipBelow ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    role="tooltip"
                    className={`pointer-events-none absolute left-1/2 z-30 hidden w-[210px] -translate-x-1/2 rounded-xl border bg-white/95 px-3 py-2 text-left shadow-xl backdrop-blur lg:block ${colors.border} ${
                      tooltipBelow ? "top-full mt-3" : "bottom-full mb-3"
                    }`}
                  >
                    <span className={`block font-mono text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>{node.role}</span>
                    <span className="mt-1 block text-[11.5px] font-normal leading-snug text-[var(--color-text-muted)]">{node.description}</span>
                    <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-faint)]">Click to inspect</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Inspection / trace panel */}
      <div id="architecture-panel" role="status" aria-live="polite" className="min-h-[120px] rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-4 sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          {inspected ? (
            <InspectPanel key={inspected.id} node={inspected} neighbours={neighbours} onClose={pinned ? () => setPinned(null) : null} />
          ) : view === "trace" ? (
            <motion.div key="trace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-blue-ink)]">Trace view</span>
                <span className="font-mono text-[10px] text-[var(--color-text-faint)]">{hop ? `hop ${step + 1} / ${TRACE_PATH.length}` : "restarting…"}</span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="mt-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
                  {hop ? hop.caption : "Client → Keycloak → Gateway → Activity → PostgreSQL → RabbitMQ → AI → Gemini → back to the client"}
                </motion.p>
              </AnimatePresence>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {TRACE_PATH.map((h, i) => (
                  <span key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: step >= 0 && i <= step ? PACKET[h.kind].color : "#e2e8f0" }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-start gap-3">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-faint)]" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                <span className="hidden sm:inline">Hover to preview, click to inspect</span>
                <span className="sm:hidden">Tap a component to inspect</span> its role, why it exists and how data flows through it — or switch to{" "}
                <button type="button" onClick={() => changeView("trace")} className="font-semibold text-[var(--color-indigo-ink)] underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-400">
                  trace view
                </button>{" "}
                to follow one request end to end.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
