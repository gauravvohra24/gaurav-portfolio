import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Leaf, Cloud, Radar, KeyRound, MessageSquareText, Database, FileJson, Sparkles, Box, Atom, Orbit, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// `links` are the technologies that light up alongside it; `flow` is where it sits in the system.
const ORBIT_ITEMS = [
  { id: "java", label: "Java", icon: Coffee, color: "#d97706", bg: "bg-amber-50", category: "Core language", note: "The language behind every service I build.", links: ["spring", "cloud"], flow: ["Java", "Spring Boot", "Spring Cloud", "Microservices"] },
  { id: "spring", label: "Spring Boot", icon: Leaf, color: "#059669", bg: "bg-emerald-50", category: "Backend", note: "REST APIs with validation, layered architecture and global exception handling.", links: ["java", "postgres", "mongodb"], flow: ["Spring Boot", "REST APIs", "Spring Data JPA"] },
  { id: "cloud", label: "Spring Cloud", icon: Cloud, color: "#2563eb", bg: "bg-blue-50", category: "Microservices", note: "API Gateway, Eureka discovery and centralized Config Server.", links: ["spring", "eureka", "keycloak"], flow: ["Spring Cloud", "API Gateway", "Eureka · Config"] },
  { id: "eureka", label: "Eureka", icon: Radar, color: "#64748b", bg: "bg-slate-100", category: "Service discovery", note: "Services register on startup; the gateway finds them by name.", links: ["cloud"], flow: ["Services", "Eureka", "API Gateway"] },
  { id: "keycloak", label: "Keycloak", icon: KeyRound, color: "#7c3aed", bg: "bg-violet-50", category: "Security", note: "OAuth2 / OIDC identity with JWT-based authorization and RBAC.", links: ["cloud"], flow: ["Keycloak", "JWT", "Gateway RBAC"] },
  { id: "rabbitmq", label: "RabbitMQ", icon: MessageSquareText, color: "#d97706", bg: "bg-amber-50", category: "Async messaging", note: "Event-driven communication that keeps AI work off the request path.", links: ["spring", "gemini"], flow: ["RabbitMQ", "AI Service", "Gemini AI"] },
  { id: "postgres", label: "PostgreSQL", icon: Database, color: "#0891b2", bg: "bg-cyan-50", category: "Relational data", note: "Relational storage for user and activity data.", links: ["spring"], flow: ["Services", "Spring Data JPA", "PostgreSQL"] },
  { id: "mongodb", label: "MongoDB", icon: FileJson, color: "#16a34a", bg: "bg-green-50", category: "Document data", note: "Document database in my toolkit alongside PostgreSQL.", links: ["spring"], flow: ["Spring Data", "MongoDB"] },
  { id: "gemini", label: "Gemini AI", icon: Sparkles, color: "#059669", bg: "bg-emerald-50", category: "Generative AI", note: "Turns activity events into personalized insights.", links: ["rabbitmq"], flow: ["RabbitMQ", "AI Service", "Gemini AI"] },
  { id: "docker", label: "Docker", icon: Box, color: "#2563eb", bg: "bg-blue-50", category: "DevOps", note: "Containerized services for consistent environments.", links: ["spring"], flow: ["Service", "Container image"] },
  { id: "react", label: "React", icon: Atom, color: "#0891b2", bg: "bg-cyan-50", category: "Frontend", note: "Component-driven UIs — including this portfolio.", links: [], flow: ["React", "This portfolio"] },
];

const SIZE = 360;
const RADIUS = 140;
const DEG_PER_SEC = 360 / 60;
const pos = (i) => {
  const angle = (i / ORBIT_ITEMS.length) * 2 * Math.PI - Math.PI / 2;
  return { x: SIZE / 2 + Math.cos(angle) * RADIUS, y: SIZE / 2 + Math.sin(angle) * RADIUS };
};
const byId = Object.fromEntries(ORBIT_ITEMS.map((item, i) => [item.id, { ...item, ...pos(i) }]));

function InfoPanel({ item }) {
  return (
    <div className="relative min-h-[196px] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <AnimatePresence mode="wait" initial={false}>
        {item ? (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}22)` }} />
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}>
                <item.icon className="h-5 w-5" style={{ color: item.color }} aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{item.label}</p>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: item.color }}>
                  {item.category}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{item.note}</p>
            <ol className="mt-4 flex flex-wrap items-center gap-1.5">
              {item.flow.map((f, i) => (
                <motion.li key={f} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.06 }} className="flex items-center gap-1.5">
                  <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--color-text-secondary)]">{f}</span>
                  {i < item.flow.length - 1 && <ArrowRight className="h-3 w-3 text-[var(--color-text-faint)]" aria-hidden="true" />}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#eef2ff,#f5f3ff)]">
              <Orbit className="h-5 w-5 text-[var(--color-indigo-ink)]" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold tracking-tight text-[var(--color-text)]">The core stack</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              The technologies behind the system above.{" "}
              <span className="hidden sm:inline">Hover one — the orbit slows and its connections light up.</span>
              <span className="sm:hidden">Tap one to see where it fits.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * A slow orbit of my stack around a central "GAURAV" node. Rotation is a CSS
 * variable driven by requestAnimationFrame (no React renders per frame), so
 * hovering can ease the speed down instead of snapping to a stop. Paused
 * off-screen and with reduced motion. Mobile gets a tappable grid.
 */
export function TechOrbit() {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);
  const ringRef = useRef(null);
  const slowRef = useRef(false);
  useEffect(() => {
    slowRef.current = hovered !== null;
  }, [hovered]);
  const active = hovered ? byId[hovered] : null;
  const related = new Set(active ? [active.id, ...active.links] : []);

  useEffect(() => {
    const el = ringRef.current;
    if (!el || reduced) return undefined;
    let angle = 0;
    let speed = 1;
    let last = 0;
    let frame = 0;
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      speed += ((slowRef.current ? 0.08 : 1) - speed) * Math.min(1, dt * 4);
      angle = (angle + DEG_PER_SEC * speed * dt) % 360;
      el.style.setProperty("--orbit", `${angle}deg`);
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div className="grid grid-cols-1 items-center justify-center gap-8 lg:grid-cols-[360px_minmax(0,440px)] lg:gap-20">
      {/* Orbit (sm+) */}
      <div className="relative mx-auto hidden h-[360px] w-[360px] items-center justify-center sm:flex" onMouseLeave={() => setHovered(null)}>
        <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-[var(--color-border)]" />
        <div className="absolute h-[180px] w-[180px] rounded-full border border-[var(--color-border-soft)] bg-[radial-gradient(circle,rgba(99,102,241,0.06),transparent_70%)]" />

        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(140deg,#6366f1,#8b5cf6_60%,#06b6d4)] shadow-xl shadow-indigo-500/30">
          <span className="dot-pulse absolute inset-0 rounded-full text-indigo-400" aria-hidden="true" />
          <span className="relative font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">Gaurav</span>
        </div>

        <div ref={ringRef} className="absolute inset-0" style={{ transform: "rotate(var(--orbit, 0deg))" }}>
          {/* connection chords rotate with the ring */}
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            {active &&
              active.links.map((id) => (
                <motion.line
                  key={`${active.id}-${id}`}
                  x1={active.x}
                  y1={active.y}
                  x2={byId[id].x}
                  y2={byId[id].y}
                  stroke={active.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              ))}
          </svg>

          {ORBIT_ITEMS.map((item) => {
            const { x, y } = byId[item.id];
            const Icon = item.icon;
            const isHovered = hovered === item.id;
            const isRelated = related.has(item.id) && !isHovered;
            const isDimmed = hovered !== null && !related.has(item.id);
            return (
              <div key={item.id} className="absolute" style={{ left: x, top: y, transform: "translate(-50%, -50%) rotate(calc(var(--orbit, 0deg) * -1))" }}>
                <button
                  type="button"
                  onMouseEnter={() => setHovered(item.id)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? "scale-[1.28] shadow-xl" : isRelated ? "scale-110 shadow-lg" : "scale-100 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.15)]"
                  } ${isDimmed ? "opacity-35" : "opacity-100"}`}
                  style={{
                    borderColor: isHovered || isRelated ? item.color : "var(--color-border)",
                    boxShadow: isHovered ? `0 12px 30px -10px ${item.color}80` : undefined,
                  }}
                  aria-label={`${item.label} — ${item.note}`}
                >
                  <Icon className="h-6 w-6" style={{ color: item.color }} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile grid */}
      <div className="grid w-full grid-cols-3 gap-2 xs:grid-cols-4 sm:hidden">
        {ORBIT_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = hovered === item.id;
          const isRelated = related.has(item.id) && !isActive;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setHovered((cur) => (cur === item.id ? null : item.id))}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1.5 rounded-xl border bg-white px-1 py-3 transition-all duration-200 ${hovered && !related.has(item.id) ? "opacity-45" : ""}`}
              style={{ borderColor: isActive || isRelated ? item.color : "var(--color-border)" }}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                <Icon className="h-4 w-4" style={{ color: item.color }} aria-hidden="true" />
              </span>
              <span className="text-center text-[10px] font-medium text-[var(--color-text-muted)]">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <InfoPanel item={active} />
      </div>
    </div>
  );
}
