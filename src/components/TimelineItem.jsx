import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, Check, ChevronDown, MessageSquareText, Network, ShieldCheck } from "lucide-react";
import { TechBadge } from "./TechBadge";
import { CATEGORY_COLORS } from "../data/categoryColors";
import { EASE, DURATION, REVEAL } from "../lib/motion";

const HIGHLIGHT_ICONS = { microservices: Network, security: ShieldCheck, messaging: MessageSquareText, api: Braces };

const group = { hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
const itemV = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } };

function DetailGroup({ title, children, className = "" }) {
  return (
    <motion.div variants={group} className={className}>
      <motion.p variants={itemV} className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
        {title}
      </motion.p>
      {children}
    </motion.div>
  );
}

export function TimelineItem({ entry }) {
  const [open, setOpen] = useState(false);
  const detailsId = `details-${entry.company.replace(/\s+/g, "-").toLowerCase()}`;
  const [start, end] = entry.period.split("—").map((s) => s.trim());

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL}
      transition={{ duration: DURATION.section, ease: EASE, layout: { duration: 0.45, ease: EASE } }}
      className="card-glow relative overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Left rail — role, company, timeline */}
        <div className="relative flex flex-col gap-5 border-b border-[var(--color-border-soft)] bg-[linear-gradient(160deg,#eef2ff_0%,#f5f3ff_55%,#ffffff_100%)] py-6 pl-10 pr-6 sm:py-7 sm:pl-11 lg:border-b-0 lg:border-r">
          {/* Vertical timeline: draws in, then a signal travels down it */}
          <span className="absolute bottom-7 left-5 top-8 w-px bg-indigo-100" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-7 left-5 top-8 w-px origin-top bg-[linear-gradient(180deg,#6366f1,#8b5cf6,#06b6d4)]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={REVEAL}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          />
          <span className="absolute left-5 top-8 -ml-[5px] h-[11px] w-[11px] rounded-full border-2 border-[var(--color-indigo)] bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.12)]" aria-hidden="true" />
          <span className="timeline-signal absolute left-5 top-8 -ml-[2.5px] h-[6px] w-[6px] rounded-full bg-[var(--color-violet)]" aria-hidden="true" />

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-indigo-ink)]">{entry.company}</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-text)]">{entry.role}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{entry.location}</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)]">
            <span>{start}</span>
            <motion.span
              className="h-[2px] flex-1 origin-left rounded-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={REVEAL}
              transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            />
            <span>{end}</span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{entry.summary}</p>
        </div>

        {/* Right — compact overview, expandable detail */}
        <div className="flex flex-col gap-5 p-6 sm:p-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entry.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[h.key];
              const colors = CATEGORY_COLORS[h.category];
              return (
                <motion.div
                  key={h.key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                  className={`group flex items-start gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-3.5 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white ${colors.hoverBorder}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.bg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`h-4 w-4 ${colors.text}`} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${colors.text}`}>{h.label}</p>
                    <p className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">{h.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-faint)]">{entry.points.length} responsibilities · {entry.tech.length} technologies</p>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3.5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:border-indigo-200 hover:bg-indigo-50/60"
            >
              {open ? "Hide details" : "View details"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={detailsId}
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <motion.div initial="hidden" animate="visible" variants={group} className="flex flex-col gap-6 border-t border-[var(--color-border-soft)] pt-5">
                  <DetailGroup title="Engineering responsibilities">
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {entry.points.map((point) => (
                        <motion.li key={point} variants={itemV} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--color-emerald-ink)]" aria-hidden="true" />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </DetailGroup>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <DetailGroup title="Architecture concepts">
                      <ul className="flex flex-wrap gap-1.5">
                        {entry.concepts.map((c) => (
                          <motion.li key={c} variants={itemV} className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                            {c}
                          </motion.li>
                        ))}
                      </ul>
                    </DetailGroup>
                    <DetailGroup title="Technologies">
                      <ul className="flex flex-wrap gap-1.5">
                        {entry.tech.map((tech) => (
                          <motion.li key={tech} variants={itemV}>
                            <TechBadge label={tech} />
                          </motion.li>
                        ))}
                      </ul>
                    </DetailGroup>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
