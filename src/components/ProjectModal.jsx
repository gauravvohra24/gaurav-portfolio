import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Target,
  Network,
  Boxes,
  ShieldCheck,
  Workflow,
  Sparkles,
  Layers,
  User,
  Activity,
  Bot,
  ArrowRight,
  Check,
} from "lucide-react";
import { EventFlowDiagram } from "./EventFlowDiagram";
import { TechBadge } from "./TechBadge";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { EASE, REVEAL } from "../lib/motion";

const SECTIONS = [
  { key: "problem", icon: Target, color: "#ec4899" },
  { key: "architecture", icon: Network, color: "#6366f1" },
  { key: "services", icon: Boxes, color: "#3b82f6" },
  { key: "security", icon: ShieldCheck, color: "#8b5cf6" },
  { key: "eventFlow", icon: Workflow, color: "#f59e0b" },
  { key: "aiIntegration", icon: Sparkles, color: "#10b981" },
  { key: "technology", icon: Layers, color: "#06b6d4" },
];

const SERVICE_ICONS = { "User Service": User, "Activity Service": Activity, "AI Service": Bot };
const FLOW_COLORS = ["#64748b", "#6366f1", "#3b82f6", "#f59e0b", "#3b82f6", "#10b981"];

function CaseSection({ id, index, heading, icon: Icon, color, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL}
      transition={{ duration: 0.5, ease: EASE }}
      className="scroll-mt-4 border-t border-[var(--color-border-soft)] py-9 first:border-t-0 first:pt-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}14` }}>
          <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[10px] font-semibold text-[var(--color-text-faint)]">0{index + 1}</p>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>
            {heading}
          </h3>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </motion.section>
  );
}

const Body = ({ children }) => <p className="text-[15px] leading-relaxed text-[var(--color-text-muted)]">{children}</p>;

export function ProjectModal({ project, open, onClose }) {
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const [active, setActive] = useState("problem");
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Highlight the section currently being read in the modal's own scroll area.
  useEffect(() => {
    if (!open) return undefined;
    let observer;
    const frame = requestAnimationFrame(() => {
      const root = scrollRef.current;
      if (!root) return;
      observer = new IntersectionObserver(
        (entries) => {
          const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (top) setActive(top.target.id.replace("cs-", ""));
        },
        { root, rootMargin: "0px 0px -65% 0px" }
      );
      root.querySelectorAll("section[id^='cs-']").forEach((el) => observer.observe(el));
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [open]);

  if (!project) return null;
  const cs = project.caseStudy;

  const jumpTo = (key) => {
    const el = scrollRef.current?.querySelector(`#cs-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionProps = (key) => {
    const i = SECTIONS.findIndex((s) => s.key === key);
    return { id: `cs-${key}`, index: i, heading: cs[key].heading, icon: SECTIONS[i].icon, color: SECTIONS[i].color };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-900/35 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden bg-white shadow-[0_40px_120px_-30px_rgba(15,23,42,0.45)] sm:h-auto sm:max-h-[90vh] sm:rounded-[28px] sm:border sm:border-[var(--color-border)]"
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-[var(--color-border-soft)] bg-[linear-gradient(115deg,#eef2ff_0%,#f5f3ff_45%,#ecfeff_100%)]">
              <div className="animated-gradient-bar absolute inset-x-0 top-0 h-1" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-6 sm:px-8">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-violet-ink)]">Case Study</p>
                  <p id="case-study-title" className="mt-1 text-xl font-extrabold uppercase tracking-tight text-[var(--color-text)] sm:text-2xl">
                    {project.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{project.subtitle}</p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close case study"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition-all hover:rotate-90 hover:text-[var(--color-text)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Case study sections" className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-3 sm:px-8">
                {SECTIONS.map(({ key, color }) => {
                  const isActive = active === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => jumpTo(key)}
                      className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="cs-nav-pill"
                          className="absolute inset-0 rounded-full border bg-white shadow-sm"
                          style={{ borderColor: `${color}55` }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative">{cs[key].heading}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-8">
              <CaseSection {...sectionProps("problem")}>
                <Body>{cs.problem.body[0]}</Body>
                <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-pink-ink)]">The goal</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{cs.problem.body[1]}</p>
                </div>
              </CaseSection>

              <CaseSection {...sectionProps("architecture")}>
                <Body>{cs.architecture.body}</Body>
                <motion.ol
                  initial="hidden"
                  whileInView="visible"
                  viewport={REVEAL}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                  className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-4"
                >
                  {cs.architecture.flow.map((step, i) => (
                    <motion.li
                      key={step}
                      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="rounded-lg border bg-white px-2.5 py-1.5 font-mono text-xs font-medium text-[var(--color-text)]"
                        style={{ borderColor: `${FLOW_COLORS[i]}40` }}
                      >
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ backgroundColor: FLOW_COLORS[i] }} />
                        {step}
                      </span>
                      {i < cs.architecture.flow.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[var(--color-text-faint)]" aria-hidden="true" />}
                    </motion.li>
                  ))}
                </motion.ol>
              </CaseSection>

              <CaseSection {...sectionProps("services")}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {cs.services.items.map((s) => {
                    const Icon = SERVICE_ICONS[s.name] ?? Boxes;
                    return (
                      <div key={s.name} className="card-lift rounded-2xl border border-[var(--color-border)] bg-white p-5 hover:border-blue-200">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                          <Icon className="h-4 w-4 text-[var(--color-blue-ink)]" aria-hidden="true" />
                        </span>
                        <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">{s.name}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-text-muted)]">{s.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CaseSection>

              <CaseSection {...sectionProps("security")}>
                <Body>{cs.security.body}</Body>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {cs.security.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/40 px-3.5 py-2.5 text-sm text-[var(--color-text-secondary)]">
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-violet-ink)]" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CaseSection>

              <CaseSection {...sectionProps("eventFlow")}>
                <Body>{cs.eventFlow.body}</Body>
                <EventFlowDiagram steps={cs.eventFlow.steps} />
              </CaseSection>

              <CaseSection {...sectionProps("aiIntegration")}>
                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-[linear-gradient(120deg,#ecfdf5,#f0fdfa_60%,#ecfeff)] p-5 sm:p-6">
                  <Sparkles className="absolute -right-2 -top-2 h-20 w-20 text-emerald-500/10" aria-hidden="true" />
                  <p className="relative text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{cs.aiIntegration.body}</p>
                </div>
              </CaseSection>

              <CaseSection {...sectionProps("technology")}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {cs.technology.groups.map((g) => (
                    <div key={g.label} className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-border-soft)] p-4">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">{g.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((item) => (
                          <TechBadge key={item} label={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CaseSection>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
