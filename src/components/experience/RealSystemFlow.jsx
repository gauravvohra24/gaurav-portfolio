import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, KeyRound, Fingerprint, Route, School, GraduationCap, Database, MousePointerClick } from "lucide-react";
import { useSequence } from "../../hooks/useSequence";
import { EASE, PACKET } from "../../lib/motion";

// Delays implement the requested entrance: identity → school → teacher → connections → database.
const NODES = {
  user: { label: "User", sub: "by role", icon: Users, color: "#64748b", bg: "bg-slate-100", delay: 0.45, info: "Admins, teachers, students, parents and staff each sign in with their own role." },
  keycloak: { label: "Keycloak", sub: "IAM", icon: KeyRound, color: "#8b5cf6", bg: "bg-violet-50", delay: 0.55, info: "Authenticates users and issues JWTs that carry their roles." },
  identity: { label: "Identity Service", sub: "auth", icon: Fingerprint, color: "#6366f1", bg: "bg-indigo-50", delay: 0.7, info: "Login, user creation and authentication flows integrated with Keycloak; enforces role-based access control." },
  gateway: { label: "API Gateway / Service Layer", sub: "routing", icon: Route, color: "#3b82f6", bg: "bg-blue-50", delay: 1.15, info: "Routes authenticated requests to the backend service that owns them." },
  school: { label: "School Service", sub: "admin", icon: School, color: "#3b82f6", bg: "bg-blue-50", delay: 0.85, info: "School administration and the core school data other modules rely on." },
  teacher: { label: "Teacher Service", sub: "workflows", icon: GraduationCap, color: "#3b82f6", bg: "bg-blue-50", delay: 1.0, info: "Teacher workflows and the APIs that expose them to the platform." },
  database: { label: "PostgreSQL", sub: "schemas", icon: Database, color: "#06b6d4", bg: "bg-cyan-50", delay: 1.55, info: "Schemas designed from ER diagrams for each backend module." },
};
const CONNECTOR_DELAY = 1.3;

// One request's journey, hop by hop (index = connector that carries the packet).
const STEPS = [
  { lights: ["keycloak"], kind: "auth" },
  { lights: ["identity"], kind: "auth" },
  { lights: ["gateway"], kind: "request" },
  { lights: ["school", "teacher"], kind: "request" },
  { lights: ["database"], kind: "data" },
];

function Node({ id, show, lit, selected, onSelect, compact }) {
  const n = NODES[id];
  const Icon = n.icon;
  return (
    <motion.button
      type="button"
      data-cursor="ring"
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      aria-label={`${n.label}: ${n.info}`}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
      transition={{ delay: n.delay, duration: 0.45, ease: EASE }}
      className={`relative flex w-full items-center gap-2 rounded-xl border bg-white text-left transition-[border-color,box-shadow] duration-300 ${compact ? "px-2 py-2" : "px-3 py-2"} ${
        selected ? "ring-2 ring-indigo-200 ring-offset-1" : ""
      }`}
      style={{
        borderColor: lit || selected ? `${n.color}88` : "var(--color-border)",
        boxShadow: lit ? `0 0 0 3px ${n.color}1c, 0 8px 20px -10px ${n.color}aa` : "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${n.bg}`}>
        <Icon className="h-3.5 w-3.5" style={{ color: n.color }} aria-hidden="true" />
      </span>
      <span className={`min-w-0 font-mono font-semibold leading-tight text-[var(--color-text)] ${compact ? "text-[10.5px]" : "truncate text-[11px]"}`}>{n.label}</span>
      {!compact && <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-faint)] xs:inline">{n.sub}</span>}
    </motion.button>
  );
}

function Wire({ show, active, kind, branch = false }) {
  const color = PACKET[kind]?.color ?? "#6366f1";
  return (
    <div className={`relative w-full ${branch ? "h-6" : "h-5"}`} aria-hidden="true">
      <motion.div
        className="absolute inset-0 origin-top"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={show ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ delay: CONNECTOR_DELAY, duration: 0.4, ease: EASE }}
      >
        {branch ? (
          <>
            <span className="absolute left-1/2 top-0 h-1/2 w-px bg-[var(--color-border)]" />
            <span className="absolute left-1/4 right-1/4 top-1/2 h-px bg-[var(--color-border)]" />
            <span className="absolute bottom-0 left-1/4 h-1/2 w-px bg-[var(--color-border)]" />
            <span className="absolute bottom-0 right-1/4 h-1/2 w-px bg-[var(--color-border)]" />
          </>
        ) : (
          <span className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-border)]" />
        )}
      </motion.div>
      {active && (
        <motion.span
          className="absolute left-1/2 top-0 -ml-[3.5px] h-[7px] w-[7px] rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}26` }}
          initial={{ y: -3, opacity: 0 }}
          animate={{ y: branch ? 20 : 16, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/**
 * The system I work on, as one request travels through it. Builds in once
 * (identity → school → teacher → wiring → database), then a single packet
 * loops quietly. Click any node for its responsibility.
 */
export function RealSystemFlow({ show }) {
  const [selected, setSelected] = useState(null);
  const { ref, step } = useSequence(STEPS.length, { interval: 1100, rest: 1, enabled: show });
  const current = step >= 0 ? STEPS[step] : null;
  const lit = (id) => Boolean(current?.lights.includes(id));
  const toggle = (id) => setSelected((cur) => (cur === id ? null : id));
  const info = selected ? NODES[selected] : null;

  return (
    <div ref={ref} className="flex flex-col">
      <div className="mx-auto flex w-full max-w-[320px] flex-col items-center">
        <Node id="user" show={show} lit={false} selected={selected === "user"} onSelect={toggle} />
        <Wire show={show} active={step === 0} kind="auth" />
        <Node id="keycloak" show={show} lit={lit("keycloak")} selected={selected === "keycloak"} onSelect={toggle} />
        <Wire show={show} active={step === 1} kind="auth" />
        <Node id="identity" show={show} lit={lit("identity")} selected={selected === "identity"} onSelect={toggle} />
        <Wire show={show} active={step === 2} kind="request" />
        <Node id="gateway" show={show} lit={lit("gateway")} selected={selected === "gateway"} onSelect={toggle} />
        <Wire show={show} active={step === 3} kind="request" branch />
        <div className="grid w-full grid-cols-2 gap-2">
          <Node id="school" compact show={show} lit={lit("school")} selected={selected === "school"} onSelect={toggle} />
          <Node id="teacher" compact show={show} lit={lit("teacher")} selected={selected === "teacher"} onSelect={toggle} />
        </div>
        <Wire show={show} active={step === 4} kind="data" />
        <Node id="database" show={show} lit={lit("database")} selected={selected === "database"} onSelect={toggle} />
      </div>

      <div className="mt-4 min-h-[64px] rounded-xl border border-[var(--color-border-soft)] bg-white/70 px-3.5 py-3" role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {info ? (
            <motion.div key={selected} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: info.color }}>
                {info.label}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)]">{info.info}</p>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-[13px] leading-snug text-[var(--color-text-muted)]">
              <MousePointerClick className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-faint)]" aria-hidden="true" />
              Click any part of the system to see its responsibility.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
