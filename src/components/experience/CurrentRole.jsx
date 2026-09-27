import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, MapPin, CalendarDays, Building2 } from "lucide-react";
import { RealSystemFlow } from "./RealSystemFlow";
import { lazyNamed } from "../../lib/lazy";
import { Deferred } from "../Deferred";
import { MagneticWrap } from "../MagneticWrap";
import { CURRENT_ROLE } from "../../data/currentRole";
import { EASE } from "../../lib/motion";

const Contributions = lazyNamed(() => import("./Contributions"), "Contributions");
const ExploreWork = lazyNamed(() => import("./ExploreWork"), "ExploreWork");

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: EASE } }),
};

const PIPELINE = ["Local", "Build", "Package", "SSH", "VM", "Docker", "Service"];
const PIPELINE_DELAY = 1.85;

export function CurrentRole() {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: "40000px 0px -15% 0px" });
  const [exploring, setExploring] = useState(false);
  const r = CURRENT_ROLE;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="gradient-border card-glow relative overflow-hidden rounded-[28px] bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Role */}
        <motion.div initial="hidden" animate={show ? "visible" : "hidden"} className="relative flex flex-col gap-5 border-b border-[var(--color-border-soft)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="grid-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <motion.div custom={0} variants={reveal} className="relative flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-indigo-ink)]">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {r.company}
            </span>
            {/* CURRENT: pulses once on entry, then just glows */}
            <motion.span
              initial={{ scale: 1, boxShadow: "0 0 0 0 rgba(16,185,129,0)" }}
              animate={show ? { scale: [1, 1.12, 1], boxShadow: ["0 0 0 0 rgba(16,185,129,0.5)", "0 0 0 8px rgba(16,185,129,0)", "0 0 14px 0 rgba(16,185,129,0.25)"] } : {}}
              transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
              className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-emerald-ink)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              Current
            </motion.span>
          </motion.div>

          <motion.div custom={1} variants={reveal} className="relative">
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-[1.9rem]">{r.role}</h3>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {r.period}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {r.location}
              </span>
            </p>
          </motion.div>

          <motion.p custom={2} variants={reveal} className="relative inline-flex w-fit items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 text-sm font-semibold text-[var(--color-indigo-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-indigo)]" aria-hidden="true" />
            {r.project}
          </motion.p>

          <motion.p custom={3} variants={reveal} className="relative text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            {r.description}
          </motion.p>

          <motion.p custom={4} variants={reveal} className="relative border-l-2 border-[var(--color-violet)] pl-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {r.ownership}
          </motion.p>

          <motion.div custom={5} variants={reveal} className="relative mt-auto flex flex-wrap gap-1.5">
            {r.focus.map((f) => (
              <span key={f} className="rounded-md bg-[var(--color-surface-2)] px-2 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)]">
                {f}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* The system */}
        <div className="flex flex-col gap-4 bg-[var(--color-surface-2)]/60 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">The system I work on</p>
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-faint)]">request flow</span>
          </div>
          <RealSystemFlow show={show} />
        </div>
      </div>

      {/* Deployment pipeline — last beat of the entrance */}
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-t border-[var(--color-border-soft)] bg-white px-6 py-4 sm:px-8">
        <motion.span
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: PIPELINE_DELAY - 0.15 }}
          className="mr-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-amber-ink)]"
        >
          Ships to real VMs
        </motion.span>
        {PIPELINE.map((stage, i) => (
          <motion.span
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: PIPELINE_DELAY + i * 0.07, duration: 0.35, ease: EASE }}
            className="flex items-center gap-1.5"
          >
            <span className="rounded-md border border-amber-100 bg-amber-50/50 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[var(--color-text-secondary)]">{stage}</span>
            {i < PIPELINE.length - 1 && <span className="text-[10px] text-amber-400" aria-hidden="true">→</span>}
          </motion.span>
        ))}
      </div>

      {/* Contributions */}
      <div className="flex flex-col gap-5 border-t border-[var(--color-border-soft)] p-4 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">Key contributions</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-text)]">Owned major backend components.</p>
          </div>
          <MagneticWrap>
            <button
              type="button"
              onClick={() => setExploring((v) => !v)}
              aria-expanded={exploring}
              aria-controls="explore-work"
              className="group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(120deg,#6366f1,#8b5cf6_60%,#06b6d4_130%)] bg-[length:180%_100%] bg-[position:0%_0%] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(99,102,241,0.7)] transition-all duration-500 hover:bg-[position:100%_0%] active:scale-[0.97]"
            >
              {exploring ? "Close technical view" : "Explore my work"}
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${exploring ? "rotate-90" : "group-hover:translate-x-0.5"}`} aria-hidden="true" />
            </button>
          </MagneticWrap>
        </div>

        <AnimatePresence initial={false}>
          {exploring && (
            <motion.div id="explore-work" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
              <Deferred minHeight={220}>
                <ExploreWork />
              </Deferred>
            </motion.div>
          )}
        </AnimatePresence>

        <Deferred className="min-h-[3800px] sm:min-h-[2900px] md:min-h-[2150px] lg:min-h-[1560px]">
          <Contributions />
        </Deferred>
      </div>
    </motion.article>
  );
}
