import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Route, User, Activity, Bot, Database, MessageSquareText, Sparkles } from "lucide-react";
import { CATEGORY_COLORS } from "../data/categoryColors";
import { useSequence } from "../hooks/useSequence";
import { polylineKeyframes, PACKET, EASE } from "../lib/motion";

const CANVAS = { width: 640, height: 440 };

const NODES = {
  client: { x: 320, y: 30, label: "Client", icon: Globe, category: "platform", pill: true, hint: "Web / mobile client" },
  gateway: { x: 320, y: 118, label: "API Gateway", sub: "Edge", icon: Route, category: "edge", hint: "JWT validation · request routing" },
  user: { x: 110, y: 246, label: "User Service", sub: "Identity", icon: User, category: "service", hint: "Identity · user synchronization" },
  activity: { x: 320, y: 246, label: "Activity Service", sub: "Tracking", icon: Activity, category: "service", hint: "Fitness activity · event publishing" },
  ai: { x: 530, y: 246, label: "AI Service", sub: "Insights", icon: Bot, category: "service", hint: "Generative insights" },
  postgres: { x: 110, y: 372, label: "PostgreSQL", sub: "Storage", icon: Database, category: "data", hint: "Persistent storage" },
  rabbitmq: { x: 320, y: 372, label: "RabbitMQ", sub: "Events", icon: MessageSquareText, category: "messaging", hint: "Async event pipeline" },
  gemini: { x: 530, y: 372, label: "Gemini AI", sub: "Model", icon: Sparkles, category: "ai", hint: "Generative AI" },
};

const P = (id) => [NODES[id].x, NODES[id].y];
const ELBOW_Y = 184;

// Orthogonal routes read as "engineered", not a sketchy web.
const EDGES = [
  { from: "client", to: "gateway", points: [P("client"), P("gateway")] },
  { from: "gateway", to: "user", points: [P("gateway"), [320, ELBOW_Y], [110, ELBOW_Y], P("user")] },
  { from: "gateway", to: "activity", points: [P("gateway"), P("activity")] },
  { from: "gateway", to: "ai", points: [P("gateway"), [320, ELBOW_Y], [530, ELBOW_Y], P("ai")] },
  { from: "user", to: "postgres", points: [P("user"), P("postgres")] },
  { from: "activity", to: "postgres", points: [P("activity"), [320, 312], [110, 312], P("postgres")] },
  { from: "activity", to: "rabbitmq", points: [P("activity"), P("rabbitmq")] },
  { from: "rabbitmq", to: "ai", points: [P("rabbitmq"), [430, 372], [430, 246], P("ai")] },
  { from: "ai", to: "gemini", points: [P("ai"), P("gemini")] },
];
const edgeKey = (a, b) => `${a}>${b}`;
const edgeByKey = Object.fromEntries(EDGES.map((e) => [edgeKey(e.from, e.to), e]));

// One real request, hop by hop. `reverse` sends the packet back along an edge.
const STEPS = [
  { from: "client", to: "gateway", kind: "request", caption: "Request enters the API Gateway" },
  { from: "gateway", to: "user", kind: "auth", caption: "JWT validated · user synchronized" },
  { from: "gateway", to: "activity", kind: "request", caption: "Routed to the Activity Service" },
  { from: "activity", to: "postgres", kind: "data", caption: "Activity persisted to PostgreSQL" },
  { from: "activity", to: "rabbitmq", kind: "event", caption: "Event published to RabbitMQ" },
  { from: "rabbitmq", to: "ai", kind: "event", caption: "AI Service consumes the event" },
  { from: "ai", to: "gemini", kind: "ai", caption: "Gemini AI generating an insight" },
  { from: "gemini", to: "ai", kind: "ai", reverse: true, caption: "Personalized insight returned" },
];

const TRAVEL = 0.85; // seconds a packet spends on one hop
const toPath = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const pct = (v, total) => `${(v / total) * 100}%`;

function hopPoints(step) {
  const edge = edgeByKey[step.reverse ? edgeKey(step.to, step.from) : edgeKey(step.from, step.to)];
  return step.reverse ? [...edge.points].reverse() : edge.points;
}

// Status lines react to the trace — honest states, no invented metrics.
function statuses(step) {
  const s = step >= 0 ? STEPS[step] : null;
  const busy = (ids) => Boolean(s && (ids.includes(s.from) || ids.includes(s.to)));
  return [
    { key: "gw", busy: busy(["gateway"]) && s.kind !== "data", idle: "Gateway online", active: "Gateway validating JWT" },
    { key: "svc", busy: busy(["user", "activity"]), idle: "3 services healthy", active: "Activity Service processing" },
    { key: "mq", busy: s?.kind === "event", idle: "RabbitMQ connected", active: "RabbitMQ · event in flight" },
    { key: "ai", busy: s?.kind === "ai", idle: "AI processing ready", active: "AI generating insight…" },
  ];
}

function Node({ id, node, index, arrival, hovered, related, dimmed, onHover }) {
  const colors = CATEGORY_COLORS[node.category];
  const Icon = node.icon;
  const tipBelow = node.y < 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: dimmed ? 0.35 : 1, y: 0, scale: hovered ? 1.06 : 1 }}
      transition={{ opacity: { duration: 0.25 }, scale: { type: "spring", stiffness: 400, damping: 28 }, default: { delay: 0.35 + index * 0.07, duration: 0.5, ease: EASE } }}
      style={{ left: pct(node.x, CANVAS.width), top: pct(node.y, CANVAS.height), zIndex: hovered ? 20 : 2 }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <button
        type="button"
        data-cursor="ring"
        aria-label={`${node.label}: ${node.hint}`}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(id)}
        onBlur={() => onHover(null)}
        onClick={() => onHover(hovered ? null : id)}
        className={`relative flex items-center rounded-xl border bg-white text-center transition-[border-color,box-shadow] duration-300 ${
          node.pill ? "gap-1.5 rounded-full px-3 py-1.5" : "w-[112px] flex-col gap-1 px-2 py-2.5 lg:w-[124px] xl:w-[132px]"
        } ${hovered || related || arrival != null ? `${colors.border} shadow-lg ${colors.ring}` : "border-[var(--color-border)] shadow-[0_4px_16px_-8px_rgba(15,23,42,0.18)]"}`}
      >
        {/* Arrival glow — plays once when a packet lands here */}
        <AnimatePresence>
          {arrival != null && (
            <motion.span
              key={arrival.step}
              className="pointer-events-none absolute -inset-1 rounded-[inherit]"
              style={{ boxShadow: `0 0 0 2px ${arrival.color}55, 0 0 28px 2px ${arrival.color}44` }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 1, 0.3], scale: [0.96, 1.05, 1] }}
              exit={{ opacity: 0 }}
              transition={{ delay: TRAVEL - 0.05, duration: 0.7, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        {/* Tiny status LED — flashes the packet's color on arrival */}
        {!node.pill && (
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: arrival ? arrival.color : "#34d399", transitionDelay: arrival ? `${TRAVEL}s` : "0s" }}
          />
        )}
        <span className={`flex items-center justify-center rounded-lg ${colors.bg} ${node.pill ? "h-5 w-5" : "h-7 w-7"}`}>
          <Icon className={`${node.pill ? "h-3 w-3" : "h-3.5 w-3.5"} ${colors.text}`} aria-hidden="true" />
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] font-semibold leading-tight text-[var(--color-text)] lg:text-[11px]">{node.label}</span>
        {node.sub && <span className="text-[9px] leading-none text-[var(--color-text-faint)] lg:text-[10px]">{node.sub}</span>}
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: tipBelow ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-[190px] -translate-x-1/2 rounded-lg border bg-white/95 px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-[var(--color-text-secondary)] shadow-lg backdrop-blur ${colors.border} ${
              tipBelow ? "top-full mt-2" : "bottom-full mb-2"
            }`}
          >
            {node.hint}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Packet({ step }) {
  const { cx, cy, times } = polylineKeyframes(hopPoints(step));
  const color = PACKET[step.kind].color;
  return (
    <motion.g
      initial={{ x: cx[0], y: cy[0], opacity: 0 }}
      animate={{ x: cx, y: cy, opacity: 1 }}
      transition={{ x: { duration: TRAVEL, times, ease: "linear" }, y: { duration: TRAVEL, times, ease: "linear" }, opacity: { duration: 0.15 } }}
    >
      <circle r="10" fill={color} opacity="0.16" />
      <circle r="4.2" fill={color} />
      <circle r="1.7" fill="#fff" />
    </motion.g>
  );
}

// Mobile: the same trace as a vertical chain — the path the request actually takes.
const CHAIN = ["client", "gateway", "activity", "rabbitmq", "ai", "gemini"];

function MobileTrace({ step }) {
  const s = step >= 0 ? STEPS[step] : null;
  return (
    <ol className="flex flex-col">
      {CHAIN.map((id, i) => {
        const node = NODES[id];
        const colors = CATEGORY_COLORS[node.category];
        const Icon = node.icon;
        const lit = s && (s.to === id || (s.reverse && s.from === id));
        const next = CHAIN[i + 1];
        const hop = s && ((s.from === id && s.to === next) || (s.reverse && s.to === id && s.from === next));
        return (
          <li key={id} className="flex flex-col items-stretch">
            <div className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2 transition-all duration-500 ${lit ? `${colors.border} shadow-md ${colors.ring}` : "border-[var(--color-border)]"}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${colors.text}`} aria-hidden="true" />
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-xs font-semibold text-[var(--color-text)]">{node.label}</span>
              <span className="ml-auto hidden min-w-0 truncate text-[10px] text-[var(--color-text-faint)] xs:block">{node.hint}</span>
            </div>
            {i < CHAIN.length - 1 && (
              <div className="relative ml-[26px] h-4 w-px bg-[var(--color-border)]">
                {hop && (
                  <motion.span
                    className="absolute -left-[3px] h-[7px] w-[7px] rounded-full"
                    style={{ backgroundColor: PACKET[s.kind].color }}
                    initial={{ y: s.reverse ? 12 : -4, opacity: 0 }}
                    animate={{ y: s.reverse ? -4 : 12, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: TRAVEL, ease: "easeInOut" }}
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Signature hero visualization: the real Gemini AI Fitness Log system running
 * one request through it — gateway, services, storage, queue, AI and back.
 * Only the hop in flight animates; hovering a node inspects it.
 */
export function ArchitectureHero() {
  const { ref, step } = useSequence(STEPS.length, { interval: 1400, rest: 1 });
  const [hoverId, setHoverId] = useState(null);
  const current = step >= 0 ? STEPS[step] : null;

  const related = useMemo(() => {
    if (!hoverId) return null;
    const ids = new Set([hoverId]);
    const edges = new Set();
    EDGES.forEach((e) => {
      if (e.from === hoverId || e.to === hoverId) {
        ids.add(e.from);
        ids.add(e.to);
        edges.add(edgeKey(e.from, e.to));
      }
    });
    return { ids, edges };
  }, [hoverId]);

  const currentEdgeKey = current ? (current.reverse ? edgeKey(current.to, current.from) : edgeKey(current.from, current.to)) : null;

  return (
    <div ref={ref} className="flex w-full flex-col gap-4">
      {/* Window chrome — frames the diagram like a running product */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="truncate font-mono text-[10px] text-[var(--color-text-faint)] sm:text-[11px]">gemini-ai-fitness-log / live-trace</span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-emerald-ink)]">
          <span className="relative flex h-1.5 w-1.5" style={{ color: "#10b981" }}>
            <span className="dot-pulse absolute inline-flex h-full w-full" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          </span>
          Live
        </span>
      </div>

      {/* Desktop / tablet */}
      <div className="relative hidden w-full sm:block" style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}>
        <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <pattern id="hero-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#e6e9f0" />
            </pattern>
          </defs>
          <rect width={CANVAS.width} height={CANVAS.height} fill="url(#hero-dots)" opacity="0.7" />

          {EDGES.map((edge) => {
            const key = edgeKey(edge.from, edge.to);
            const focus = related?.edges.has(key);
            return (
              <path
                key={key}
                d={toPath(edge.points)}
                fill="none"
                stroke={focus ? CATEGORY_COLORS[NODES[hoverId].category].dot : "#dfe3ec"}
                strokeWidth={focus ? 2 : 1.5}
                strokeLinejoin="round"
                opacity={related && !focus ? 0.35 : 1}
                className={focus ? "flow-line" : ""}
                style={{ transition: "stroke 0.25s ease, opacity 0.25s ease" }}
              />
            );
          })}

          {current && (
            <motion.path
              key={`trail-${step}`}
              d={toPath(hopPoints(current))}
              fill="none"
              stroke={PACKET[current.kind].color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.9 }}
              animate={{ pathLength: 1, opacity: [0.9, 0.9, 0.3] }}
              transition={{ pathLength: { duration: TRAVEL, ease: "linear" }, opacity: { duration: 1.4, times: [0, 0.6, 1] } }}
              data-edge={currentEdgeKey}
            />
          )}
          {current && <Packet key={`packet-${step}`} step={current} />}
        </svg>

        {Object.entries(NODES).map(([id, node], i) => (
          <Node
            key={id}
            id={id}
            node={node}
            index={i}
            arrival={current?.to === id ? { step, color: PACKET[current.kind].color } : null}
            hovered={hoverId === id}
            related={Boolean(related?.ids.has(id)) && hoverId !== id}
            dimmed={Boolean(related) && !related.ids.has(id)}
            onHover={setHoverId}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <MobileTrace step={step} />
      </div>

      {/* System status + narration */}
      <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">System status</span>
          <span className="flex items-center gap-2.5" aria-hidden="true">
            {["request", "auth", "event", "ai"].map((k) => (
              <span key={k} className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-faint)]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PACKET[k].color }} />
                <span className="hidden md:inline">{PACKET[k].label}</span>
              </span>
            ))}
          </span>
        </div>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 xs:grid-cols-2">
          {statuses(step).map((st) => (
            <li key={st.key} className="flex min-w-0 items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
              <span className={`relative flex h-1.5 w-1.5 shrink-0 ${st.busy ? "text-amber-400" : "text-emerald-400"}`}>
                {st.busy && <span className="dot-pulse absolute inline-flex h-full w-full" />}
                <span className={`relative h-1.5 w-1.5 rounded-full ${st.busy ? "bg-amber-400" : "bg-emerald-400"}`} />
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={st.busy ? "a" : "i"} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }} className="truncate">
                  {st.busy ? st.active : st.idle}
                </motion.span>
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex h-5 items-center gap-2 border-t border-[var(--color-border-soft)] pt-2">
          <span className="font-mono text-[10px] font-semibold text-[var(--color-text-faint)]">{current ? `0${step + 1}/0${STEPS.length}` : "—/—"}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22 }} className="truncate text-xs font-medium text-[var(--color-text-secondary)]">
              {current ? current.caption : "Waiting for the next request"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
