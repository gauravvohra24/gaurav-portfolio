import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Globe, Route, User, Activity, Bot, Database, MessageSquareText, Sparkles, Play, RotateCcw, Check, Loader2 } from "lucide-react";
import { CATEGORY_COLORS } from "../data/categoryColors";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { polylineKeyframes, PACKET, EASE } from "../lib/motion";

const VIEW = { w: 340, h: 312 };

// Build order: client → gateway → services → RabbitMQ → Gemini → PostgreSQL.
const NODES = {
  client: { x: 170, y: 22, w: 88, h: 26, label: "Client", icon: Globe, category: "platform", delay: 0 },
  gateway: { x: 170, y: 88, w: 124, h: 34, label: "API Gateway", icon: Route, category: "edge", delay: 0.18 },
  user: { x: 56, y: 172, w: 100, h: 36, label: "User", icon: User, category: "service", delay: 0.36 },
  activity: { x: 170, y: 172, w: 100, h: 36, label: "Activity", icon: Activity, category: "service", delay: 0.46 },
  ai: { x: 284, y: 172, w: 100, h: 36, label: "AI Service", icon: Bot, category: "service", delay: 0.56 },
  rabbitmq: { x: 170, y: 272, w: 100, h: 36, label: "RabbitMQ", icon: MessageSquareText, category: "messaging", delay: 0.8 },
  gemini: { x: 284, y: 272, w: 100, h: 36, label: "Gemini AI", icon: Sparkles, category: "ai", delay: 0.95 },
  postgres: { x: 56, y: 272, w: 100, h: 36, label: "PostgreSQL", icon: Database, category: "data", delay: 1.1 },
};
const P = (id) => [NODES[id].x, NODES[id].y];

const EDGES = [
  { from: "client", to: "gateway", points: [P("client"), P("gateway")] },
  { from: "gateway", to: "user", points: [P("gateway"), [170, 130], [56, 130], P("user")] },
  { from: "gateway", to: "activity", points: [P("gateway"), P("activity")] },
  { from: "gateway", to: "ai", points: [P("gateway"), [170, 130], [284, 130], P("ai")] },
  { from: "user", to: "postgres", points: [P("user"), P("postgres")] },
  { from: "activity", to: "postgres", points: [P("activity"), [170, 222], [56, 222], P("postgres")] },
  { from: "activity", to: "rabbitmq", points: [P("activity"), P("rabbitmq")] },
  { from: "rabbitmq", to: "ai", points: [P("rabbitmq"), [227, 272], [227, 172], P("ai")] },
  { from: "ai", to: "gemini", points: [P("ai"), P("gemini")] },
];

function routeFor(ids) {
  // Chain edges along a node path, reversing any edge walked backwards.
  const pts = [];
  for (let i = 0; i < ids.length - 1; i++) {
    const a = ids[i];
    const b = ids[i + 1];
    const fwd = EDGES.find((e) => e.from === a && e.to === b);
    const seg = fwd ? fwd.points : [...EDGES.find((e) => e.from === b && e.to === a).points].reverse();
    pts.push(...(i === 0 ? seg : seg.slice(1)));
  }
  return pts;
}

// The eight beats of one request. Timings below are animation pacing only.
const STEPS = [
  { label: "Request received", route: ["client", "gateway"], kind: "request", node: "gateway" },
  { label: "JWT validated", kind: "auth", node: "gateway" },
  { label: "Activity Service processing", route: ["gateway", "activity"], side: ["activity", "postgres"], kind: "request", node: "activity" },
  { label: "Event published", route: ["activity", "rabbitmq"], kind: "event", node: "rabbitmq" },
  { label: "RabbitMQ queued", kind: "event", node: "rabbitmq" },
  { label: "AI Service consuming", route: ["rabbitmq", "ai"], kind: "event", node: "ai" },
  { label: "Gemini generating insight", route: ["ai", "gemini"], kind: "ai", node: "gemini" },
  { label: "Response returned", route: ["gemini", "ai", "gateway", "client"], kind: "ai", node: "client" },
];

const SPEED = 240; // viewBox units per second
const DWELL = 420; // ms a node "works" before the next beat
const toPath = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const routeLength = (pts) => pts.reduce((acc, p, i) => (i ? acc + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
const travelFor = (step) => (step.route ? Math.max(0.45, routeLength(routeFor(step.route)) / SPEED) : 0);

function Packet({ points, color, delay = 0 }) {
  const { cx, cy, times } = polylineKeyframes(points);
  const duration = Math.max(0.45, routeLength(points) / SPEED);
  return (
    <motion.g
      initial={{ x: cx[0], y: cy[0], opacity: 0 }}
      animate={{ x: cx, y: cy, opacity: 1 }}
      transition={{ x: { duration, times, ease: "linear", delay }, y: { duration, times, ease: "linear", delay }, opacity: { duration: 0.12, delay } }}
    >
      <circle r="9" fill={color} opacity="0.18" />
      <circle r="3.8" fill={color} />
      <circle r="1.5" fill="#fff" />
    </motion.g>
  );
}

function SvgNode({ id, node, built, reduced, state, color }) {
  const colors = CATEGORY_COLORS[node.category];
  const Icon = node.icon;
  const lit = state === "active";
  const done = state === "done";
  const isPill = id === "client";
  const x = node.x - node.w / 2;
  const y = node.y - node.h / 2;
  const iconX = isPill ? x + 10 : x + 9;

  return (
    <motion.g
      initial={reduced ? false : { opacity: 0, scale: 0.8 }}
      animate={built ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay: reduced ? 0 : node.delay, duration: 0.45, ease: EASE }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {lit && (
        <motion.rect
          key={`${id}-${color}`}
          x={x - 4}
          y={y - 4}
          width={node.w + 8}
          height={node.h + 8}
          rx={isPill ? 17 : 13}
          fill="none"
          stroke={color}
          strokeWidth="5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0.18] }}
          transition={{ duration: 0.6 }}
        />
      )}
      <rect
        x={x}
        y={y}
        width={node.w}
        height={node.h}
        rx={isPill ? 13 : 9}
        fill="#fff"
        stroke={lit ? color : done ? `${colors.dot}88` : "#e2e8f0"}
        strokeWidth={lit ? 1.6 : 1}
        style={{ transition: "stroke 0.3s ease" }}
      />
      <rect x={iconX} y={node.y - 8} width="16" height="16" rx="4" fill={colors.dot} opacity="0.12" />
      <Icon x={iconX + 3} y={node.y - 5} width="10" height="10" color={colors.dot} strokeWidth={2.2} aria-hidden="true" />
      <text x={iconX + 22} y={node.y + 3.5} fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="600" fill="#111827">
        {node.label}
      </text>
      {!isPill && <circle cx={x + node.w - 8} cy={y + 8} r="2.2" fill={lit ? color : "#34d399"} style={{ transition: "fill 0.3s ease" }} />}
    </motion.g>
  );
}

/**
 * Featured-project system map. When it scrolls into view the architecture
 * builds itself, then runs one complete request. "Run Request" replays it
 * step by step with a trace log. It's an illustration of the design — the
 * timer measures this animation, nothing else.
 */
export function SystemTrace() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [phase, setPhase] = useState("idle"); // idle | running | complete
  const [step, setStep] = useState(-1);
  const [runId, setRunId] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const timeouts = useRef([]);
  const built = inView;

  const clearAll = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    cancelAnimationFrame(timerRef.current?.frame ?? 0);
  };

  const run = useCallback(() => {
    clearAll();
    setRunId((n) => n + 1);
    setPhase("running");
    setElapsed(0);
    const started = performance.now();
    const tick = () => {
      const t = (performance.now() - started) / 1000;
      if (timerRef.current?.label) timerRef.current.label.textContent = `${t.toFixed(1)}s`;
      timerRef.current.frame = requestAnimationFrame(tick);
    };
    timerRef.current = { ...(timerRef.current ?? {}), frame: requestAnimationFrame(tick) };

    let at = 0;
    STEPS.forEach((s, i) => {
      timeouts.current.push(setTimeout(() => setStep(i), at));
      at += reduced ? 260 : travelFor(s) * 1000 + DWELL + (s.side ? 400 : 0);
    });
    timeouts.current.push(
      setTimeout(() => {
        cancelAnimationFrame(timerRef.current?.frame ?? 0);
        setElapsed((performance.now() - started) / 1000);
        setStep(STEPS.length);
        setPhase("complete");
      }, at)
    );
  }, [reduced]);

  // Build, then run once automatically the first time it's seen.
  useEffect(() => {
    if (!inView) return undefined;
    const t = setTimeout(run, reduced ? 0 : 1700);
    return () => clearTimeout(t);
  }, [inView, run, reduced]);

  useEffect(() => clearAll, []);

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const color = current ? PACKET[current.kind].color : null;
  const visited = new Set(STEPS.slice(0, Math.max(0, step)).map((s) => s.node));
  const activeRoute = current?.route ? routeFor(current.route) : null;

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Live architecture</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              phase === "complete" ? "bg-emerald-50 text-[var(--color-emerald-ink)]" : phase === "running" ? "bg-indigo-50 text-[var(--color-indigo-ink)]" : "bg-slate-100 text-slate-500"
            }`}
          >
            {phase === "complete" ? <Check className="h-3 w-3" /> : phase === "running" ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
            {phase === "complete" ? `Trace complete · ${elapsed.toFixed(1)}s` : phase === "running" ? "Tracing" : "Ready"}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mx-auto w-full max-w-[420px]">
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full overflow-visible" role="img" aria-label="Gemini AI Fitness Log architecture: Client, API Gateway, User, Activity and AI services, RabbitMQ, Gemini AI and PostgreSQL">
          {EDGES.map((e) => {
            const delay = Math.max(NODES[e.from].delay, NODES[e.to].delay) + 0.15;
            return (
              <motion.path
                key={`${e.from}-${e.to}`}
                d={toPath(e.points)}
                fill="none"
                stroke="#dfe3ec"
                strokeWidth="1.4"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={built ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ delay: reduced ? 0 : delay, duration: 0.5, ease: "easeInOut" }}
              />
            );
          })}

          {activeRoute && !reduced && (
            <motion.path
              key={`trail-${runId}-${step}`}
              d={toPath(activeRoute)}
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.95 }}
              animate={{ pathLength: 1, opacity: [0.95, 0.95, 0.35] }}
              transition={{ pathLength: { duration: travelFor(current), ease: "linear" }, opacity: { duration: travelFor(current) + 0.8, times: [0, 0.7, 1] } }}
            />
          )}
          {activeRoute && !reduced && <Packet key={`p-${runId}-${step}`} points={activeRoute} color={color} />}
          {current?.side && !reduced && (
            <Packet key={`s-${runId}-${step}`} points={routeFor(current.side)} color={PACKET.data.color} delay={travelFor(current) + 0.1} />
          )}

          {Object.entries(NODES).map(([id, node]) => (
            <SvgNode
              key={id}
              id={id}
              node={node}
              built={built}
              reduced={reduced}
              color={color}
              state={current?.node === id ? "active" : visited.has(id) || (phase === "complete" && STEPS.some((s) => s.node === id)) ? "done" : "idle"}
            />
          ))}
        </svg>
      </div>

      {/* Trace log */}
      <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2" aria-live="polite">
        {STEPS.map((s, i) => {
          const state = i < step || phase === "complete" ? "done" : i === step ? "active" : "pending";
          const c = PACKET[s.kind].color;
          return (
            <li
              key={s.label}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition-all duration-300 ${
                state === "active" ? "border-transparent bg-white shadow-md" : state === "done" ? "border-transparent bg-white/60" : "border-dashed border-[var(--color-border)] bg-transparent"
              }`}
              style={state === "active" ? { boxShadow: `0 0 0 1px ${c}55, 0 8px 20px -10px ${c}88` } : undefined}
            >
              <span className="font-mono text-[10px] font-bold text-[var(--color-text-faint)]">0{i + 1}</span>
              <span className={`truncate ${state === "pending" ? "text-[var(--color-text-faint)]" : "font-medium text-[var(--color-text-secondary)]"}`}>{s.label}</span>
              <span className="ml-auto flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                {state === "done" ? (
                  <Check className="h-3.5 w-3.5 text-[var(--color-emerald-ink)]" aria-label="done" />
                ) : state === "active" ? (
                  <span className="relative flex h-2 w-2" style={{ color: c }}>
                    <span className="dot-pulse absolute inline-flex h-full w-full" />
                    <span className="relative h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={run}
          disabled={phase === "running"}
          className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text)] shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 active:scale-[0.97] disabled:cursor-progress disabled:text-[var(--color-indigo-ink)]"
        >
          {phase === "running" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Running trace… <span ref={(el) => { if (timerRef.current) timerRef.current.label = el; else timerRef.current = { label: el }; }} className="tabular-nums text-[var(--color-text-faint)]">0.0s</span>
            </>
          ) : phase === "complete" ? (
            <>
              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-180" aria-hidden="true" />
              Run request again
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Run request
            </>
          )}
        </button>
        <p className="text-[11px] leading-snug text-[var(--color-text-faint)] sm:max-w-[220px] sm:text-right">
          Interactive architecture simulation — timings reflect this animation, not real measurements.
        </p>
      </div>
    </div>
  );
}
