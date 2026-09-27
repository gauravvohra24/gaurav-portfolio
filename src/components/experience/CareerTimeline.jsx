import { motion } from "framer-motion";
import { CAREER_ARC } from "../../data/currentRole";
import { EASE, REVEAL } from "../../lib/motion";

const MILESTONES = [
  { when: "Dec 2025", title: "Spring Boot Training", org: "VVDN Technologies", detail: "Microservices foundation · Gemini AI Fitness Log" },
  { when: "Apr 2026", title: "Software Engineer Trainee", org: "VVDN Technologies", detail: "School Management System — Nepal", current: true },
  { when: "Present", title: "Backend · Microservices · IAM · Deployment", org: "Ongoing", detail: "Identity, school & teacher services" },
];

/**
 * Career story in two layers: three milestones (with the live, current role
 * glowing), then the arc of what that path has covered so far.
 */
export function CareerTimeline() {
  return (
    <div className="flex flex-col gap-6">
      <ol className="relative grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {/* connecting rail (desktop) */}
        <motion.span
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-[22px] hidden h-px origin-left bg-[linear-gradient(90deg,#c7d2fe,#8b5cf6,#06b6d4)] md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={REVEAL}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        />
        {MILESTONES.map((m, i) => (
          <motion.li
            key={m.when}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.15, ease: EASE }}
            className="relative flex gap-3 md:flex-col md:items-center md:text-center"
          >
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm" style={{ borderColor: m.current ? "#a5b4fc" : "var(--color-border)" }}>
              <span className={`relative h-3 w-3 rounded-full ${m.current ? "bg-[linear-gradient(140deg,#6366f1,#8b5cf6)] shadow-[0_0_12px_rgba(99,102,241,0.6)]" : i === 0 ? "bg-slate-300" : "border-2 border-dashed border-cyan-400 bg-white"}`} />
            </span>
            <div className={`flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl px-3 py-2 md:items-center ${m.current ? "border border-indigo-100 bg-white/80 shadow-[0_10px_30px_-18px_rgba(99,102,241,0.6)]" : ""}`}>
              <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                {m.when}
                {m.current && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] text-[var(--color-emerald-ink)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    Current
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-[var(--color-text)]">{m.title}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{m.org}</span>
              <span className="text-[11.5px] text-[var(--color-text-faint)]">{m.detail}</span>
            </div>
          </motion.li>
        ))}
      </ol>

      {/* The arc */}
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
        className="flex flex-wrap items-center gap-x-1 gap-y-2"
        aria-label="Career arc"
      >
        {CAREER_ARC.map((step, i) => (
          <motion.li
            key={step.label}
            variants={{ hidden: { opacity: 0, x: -6 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }}
            className="flex items-center gap-1"
          >
            <span
              className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${
                step.phase === "training" ? "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]" : "border-indigo-100 bg-indigo-50/60 text-[var(--color-indigo-ink)]"
              } ${i === CAREER_ARC.length - 1 ? "border-indigo-200 bg-[linear-gradient(120deg,#eef2ff,#ecfeff)] font-semibold" : ""}`}
            >
              {step.label}
            </span>
            {i < CAREER_ARC.length - 1 && <span className="text-[10px] text-[var(--color-text-faint)]" aria-hidden="true">→</span>}
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
