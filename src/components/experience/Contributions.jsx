import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Fingerprint, Boxes, Workflow, DatabaseZap, Braces, Rocket, Users, ChevronDown, School, GraduationCap, Check } from "lucide-react";
import { Tilt } from "../Tilt";
import { FlowChain } from "./FlowChain";
import { useFinePointer } from "../../hooks/useFinePointer";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE, DURATION } from "../../lib/motion";
import { PLATFORM_ROLES, MAJOR_ROLE_COUNT, IAM_CAPABILITIES, PRIMARY_SERVICES, SERVICE_TECH, DELIVERY_STAGES } from "../../data/currentRole";

const Label = ({ children }) => <p className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">{children}</p>;

function CardShell({ index, title, icon: Icon, color, bg, active, onActivate, onDeactivate, onToggle, className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: DURATION.section, delay: (index % 3) * 0.06, ease: EASE }}
      className={className}
    >
      <Tilt
        max={1.2}
        data-active={active}
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        onFocus={onActivate}
        onClick={onToggle}
        style={{ "--glow": `${color}12` }}
        className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border bg-white p-5 sm:p-6"
      >
        <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden" aria-hidden="true">
          <span
            className={`block h-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? "w-full" : "w-10"}`}
            style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }}
          />
        </span>
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} transition-transform duration-300 group-hover:scale-110 group-data-[active=true]:scale-110`}>
            <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
          </span>
          <h4 className="text-[15px] font-semibold leading-snug tracking-tight text-[var(--color-text)]">{title}</h4>
          <span className="ml-auto font-mono text-xs font-bold transition-colors duration-300" style={{ color: active ? color : "#cbd5e1" }}>
            0{index + 1}
          </span>
        </div>
        {children}
      </Tilt>
    </motion.div>
  );
}

// ---------- 01 · IAM ----------
function IamBody({ active }) {
  const [showAll, setShowAll] = useState(false);
  const roles = showAll ? PLATFORM_ROLES : PLATFORM_ROLES.slice(0, MAJOR_ROLE_COUNT);
  return (
    <>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">Built the Identity Service and integrated Keycloak for authentication and authorization.</p>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 xs:grid-cols-2">
        {IAM_CAPABILITIES.map((c) => (
          <li key={c} className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
            <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-violet-ink)]" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
      <FlowChain nodes={["Login", "Keycloak", "JWT", "RBAC", "Secure service access"]} running={active} color="#8b5cf6" layout="auto" />
      <div className="mt-auto rounded-xl border border-violet-100 bg-violet-50/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Platform roles</Label>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAll((v) => !v);
            }}
            aria-expanded={showAll}
            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-violet-ink)] hover:underline"
          >
            {showAll ? "Show fewer" : `View roles (+${PLATFORM_ROLES.length - MAJOR_ROLE_COUNT})`}
            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </div>
        <motion.ul layout className="mt-2 flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {roles.map((r, i) => (
              <motion.li
                key={r}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: i >= MAJOR_ROLE_COUNT ? (i - MAJOR_ROLE_COUNT) * 0.04 : 0 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-md border border-violet-200 bg-white px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[var(--color-violet-ink)]"
              >
                {r}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </>
  );
}

// ---------- 02 · Services ----------
const SERVICE_ICONS = { identity: Fingerprint, school: School, teacher: GraduationCap };
function ServicesBody({ active }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        Designed and implemented backend services for school administration, identity management and teacher workflows, with APIs consumed across the platform.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label>Services I primarily handled</Label>
        {PRIMARY_SERVICES.slice(0, 3).map((s, i) => {
          const Icon = SERVICE_ICONS[s.key];
          return (
            <div
              key={s.key}
              className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 transition-transform duration-300"
              style={{ transform: active ? `translateX(${4 + i * 2}px)` : "none", transitionDelay: `${i * 50}ms` }}
            >
              <Icon className="h-3.5 w-3.5 text-[var(--color-blue-ink)]" aria-hidden="true" />
              <span className="font-mono text-[11px] font-semibold text-[var(--color-text)]">{s.label}</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex flex-wrap gap-1">
        {SERVICE_TECH.map((t) => (
          <span key={t} className="rounded-md bg-blue-50/70 px-1.5 py-0.5 text-[11px] text-[var(--color-blue-ink)]">
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

// ---------- 03 · Integration (continuous, clickable) ----------
function IntegrationBody() {
  const [selected, setSelected] = useState(0);
  const s = PRIMARY_SERVICES[selected];
  return (
    <>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">How the services I own fit together. Click one to see its responsibility.</p>
      <FlowChain nodes={PRIMARY_SERVICES.map((p) => p.label)} running color="#6366f1" interval={900} selected={selected} onSelect={setSelected} size="md" />
      <div className="mt-auto rounded-xl border border-indigo-100 bg-indigo-50/40 p-3" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.key} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-indigo-ink)]">{s.hint}</p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)]">{s.responsibility}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// ---------- 04 · Data ----------
/** Abstract ER sketch: unnamed entities and relationship lines (no invented tables). */
function ErPreview({ active }) {
  const reduced = usePrefersReducedMotion();
  const entity = (x, y, rows, i) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="62" height={14 + rows * 9} rx="4" fill="#fff" stroke="#a5f3fc" />
      <rect x={x} y={y} width="62" height="11" rx="4" fill="#06b6d4" opacity="0.18" />
      {Array.from({ length: rows }, (_, r) => (
        <motion.rect
          key={r}
          x={x + 6}
          y={y + 15 + r * 9}
          height="3"
          rx="1.5"
          fill="#cbd5e1"
          initial={false}
          animate={{ width: active && !reduced ? [18, 44 - r * 6, 30] : 36 - r * 6 }}
          transition={{ duration: 1.2, delay: i * 0.15 + r * 0.08, repeat: active && !reduced ? Infinity : 0, repeatDelay: 1 }}
        />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 220 76" className="h-auto w-full" aria-hidden="true">
      {["M72 22 H100 M100 22 V52 H146", "M72 22 L78 17 M72 22 L78 27", "M146 52 L140 47 M146 52 L140 57"].map((d, i) => (
        <motion.path key={d} d={d} fill="none" stroke="#06b6d4" strokeWidth="1.2" initial={false} animate={{ pathLength: active ? [0, 1] : 1, opacity: 0.8 }} transition={{ duration: 0.8, delay: i * 0.1 }} />
      ))}
      {entity(10, 6, 4, 0)}
      {entity(84, 44, 2, 1)}
      {entity(148, 30, 3, 2)}
    </svg>
  );
}
function DataBody({ active }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        Designed database schemas and ER diagrams for backend modules and translated functional requirements into service-level data models.
      </p>
      <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-2.5">
        <ErPreview active={active} />
      </div>
      <FlowChain nodes={["Requirements", "ER Diagram", "Database Schema", "REST APIs", "Service Integration"]} running={active} color="#06b6d4" className="mt-auto" />
    </>
  );
}

// ---------- 05 · APIs ----------
function ApiBody({ active }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        Designed and delivered REST APIs across backend modules, working with the team to integrate and test APIs across services.
      </p>
      <FlowChain
        nodes={[{ label: "Controller", sub: "REST" }, { label: "Service", sub: "logic" }, { label: "Repository", sub: "JPA" }, { label: "PostgreSQL" }]}
        running={active}
        color="#3b82f6"
        size="md"
        className="mt-auto"
      />
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">{active ? "request travelling through the layers…" : "hover to send a request"}</p>
    </>
  );
}

// ---------- 06 · Deployment ----------
const TERMINAL = [
  { cmd: "ssh deploy@vm", out: null },
  { cmd: "./deploy.sh", out: "building service…" },
  { cmd: "docker build -t service .", out: null },
  { cmd: "docker run -d service", out: null },
  { cmd: null, out: "✓ service healthy" },
];
function Terminal({ play }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-[#0f172a] p-3 font-mono text-[11px] leading-relaxed shadow-inner">
      <div className="mb-2 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-[9px] uppercase tracking-wider text-slate-500">illustrative · not literal commands</span>
      </div>
      {TERMINAL.map((line, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, x: -4 }}
          animate={play ? { opacity: 1, x: 0 } : reduced ? { opacity: 1 } : { opacity: 0, x: -4 }}
          transition={{ delay: reduced ? 0 : 0.2 + i * 0.45, duration: 0.25 }}
        >
          {line.cmd && (
            <p className="truncate text-slate-200">
              <span className="text-emerald-400">$</span> {line.cmd}
            </p>
          )}
          {line.out && <p className={line.out.startsWith("✓") ? "text-emerald-400" : "text-slate-500"}>{line.out}</p>}
        </motion.div>
      ))}
      <span className="terminal-caret mt-0.5 inline-block h-3 w-1.5 bg-slate-300" aria-hidden="true" />
    </div>
  );
}
function DeployBody({ active }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Worked with real deployment environments and deployed backend services using SSH-based VM workflows — not just a local demo.
        </p>
        <FlowChain nodes={["Local", "Build", "Package", "SSH", "VM", "Docker", "Service"]} running={active} color="#f59e0b" layout="auto" className="mt-auto" />
      </div>
      <Terminal play={seen} />
    </div>
  );
}

// ---------- 07 · Team delivery ----------
function DeliveryBody({ active }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        Worked with the engineering team to design, implement, test and deliver backend APIs and integrate services into the larger School Management System.
      </p>
      {/* A delivery track, not a tag cloud: each stage feeds the next */}
      <ol className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {DELIVERY_STAGES.map((stage, i) => (
          <li
            key={stage}
            className="relative flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 transition-[border-color,background-color,transform] duration-300"
            style={active ? { transitionDelay: `${i * 70}ms`, borderColor: "#a7f3d0", backgroundColor: "#fff", transform: "translateY(-2px)" } : { transitionDelay: `${i * 30}ms` }}
          >
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-[var(--color-emerald-ink)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,#10b981,transparent)] opacity-60" />
            </span>
            <span className="text-[12.5px] font-semibold leading-tight text-[var(--color-text)]">{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const CARDS = [
  { key: "iam", title: "Identity & Access Management", icon: Fingerprint, color: "#8b5cf6", bg: "bg-violet-50", Body: IamBody, span: "md:col-span-2 lg:col-span-2" },
  { key: "services", title: "School Management Microservices", icon: Boxes, color: "#3b82f6", bg: "bg-blue-50", Body: ServicesBody, span: "" },
  { key: "integration", title: "Microservice Integration", icon: Workflow, color: "#6366f1", bg: "bg-indigo-50", Body: IntegrationBody, span: "" },
  { key: "data", title: "Database & System Design", icon: DatabaseZap, color: "#06b6d4", bg: "bg-cyan-50", Body: DataBody, span: "" },
  { key: "api", title: "API Development", icon: Braces, color: "#3b82f6", bg: "bg-blue-50", Body: ApiBody, span: "" },
  { key: "deploy", title: "Real Deployment", icon: Rocket, color: "#f59e0b", bg: "bg-amber-50", Body: DeployBody, span: "md:col-span-2 lg:col-span-3" },
  { key: "team", title: "Team Delivery", icon: Users, color: "#10b981", bg: "bg-emerald-50", Body: DeliveryBody, span: "md:col-span-2 lg:col-span-3" },
];

export function Contributions() {
  const [active, setActive] = useState(null);
  const fine = useFinePointer();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {CARDS.map(({ key, Body, span, ...card }, i) => (
        <CardShell
          key={key}
          index={i}
          {...card}
          className={span}
          active={active === key}
          onActivate={() => fine && setActive(key)}
          onDeactivate={() => fine && setActive(null)}
          onToggle={() => !fine && setActive((cur) => (cur === key ? null : key))}
        >
          <Body active={active === key} />
        </CardShell>
      ))}
    </div>
  );
}
