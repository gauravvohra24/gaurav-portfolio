import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Boxes, KeyRound, MessageSquareText, Network, Radar, Sparkles, UserCheck } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { MagneticWrap } from "../components/MagneticWrap";
import { lazyNamed } from "../lib/lazy";
import { Deferred } from "../components/Deferred";
import { TechBadge } from "../components/TechBadge";
import { AmbientGlow } from "../components/AmbientGlow";
import { usePointerGlow } from "../hooks/usePointerGlow";
import { EASE, REVEAL } from "../lib/motion";
import { FEATURED_PROJECT } from "../data/project";

const SystemTrace = lazyNamed(() => import("../components/SystemTrace"), "SystemTrace");
const ProjectModal = lazyNamed(() => import("../components/ProjectModal"), "ProjectModal");

const HIGHLIGHT_ICONS = [Boxes, Sparkles, KeyRound, MessageSquareText, UserCheck, Radar];
const HIGHLIGHT_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#6366f1", "#06b6d4"];

export function FeaturedProject() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const { nodeRef: glowRef, onMouseMove: onGlowMove } = usePointerGlow();
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <section id="project" className="relative py-16 sm:py-24">
      <AmbientGlow variant="project" />
      <Container className="flex flex-col gap-10">
        <SectionHeading chapter="project" eyebrow="Featured Project" title="One system, built end to end." />

        <motion.article
          ref={glowRef}
          onMouseMove={onGlowMove}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL}
          transition={{ duration: 0.7, ease: EASE }}
          className="pointer-glow gradient-border card-glow overflow-hidden rounded-[32px] bg-white"
        >
          {/* Masthead */}
          <div className="relative overflow-hidden border-b border-[var(--color-border-soft)] bg-[linear-gradient(115deg,#eef2ff_0%,#f5f3ff_42%,#ecfeff_100%)] px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid-fade pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-violet-ink)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-violet)]" />
                  Case Study · Flagship Build
                </p>
                <h3 className="mt-3 text-balance text-[1.9rem] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl lg:text-[3.4rem]">
                  Gemini AI <span className="text-gradient-brand">Fitness Log</span>
                </h3>
                <p className="mt-3 text-base font-medium text-[var(--color-text-muted)] sm:text-lg">{FEATURED_PROJECT.subtitle}</p>
              </div>

              <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:grid-cols-2">
                {FEATURED_PROJECT.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-faint)]">{stat.label}</dt>
                    <dd className="text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
            {/* Story side */}
            <div className="flex flex-col gap-7 p-6 sm:p-10">
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">{FEATURED_PROJECT.tagline}</p>

              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                  Engineering highlights
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {FEATURED_PROJECT.capabilities.map((capability, i) => {
                    const Icon = HIGHLIGHT_ICONS[i] ?? Network;
                    const color = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
                    return (
                      <motion.li
                        key={capability}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={REVEAL}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: EASE }}
                        className="flex items-start gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/70 p-3 text-sm leading-snug text-[var(--color-text-muted)]"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}14` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
                        </span>
                        <span className="pt-1">{capability}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">Tech stack</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {FEATURED_PROJECT.tech.map((tech) => (
                    <TechBadge key={tech} label={tech} />
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2 xs:flex-row xs:items-center">
                <MagneticWrap className="w-full xs:w-auto">
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  className="glow-btn group inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(120deg,#6366f1,#8b5cf6_60%,#06b6d4_130%)] bg-[length:180%_100%] bg-[position:0%_0%] px-6 text-sm font-semibold text-white transition-all duration-500 hover:bg-[position:100%_0%] active:scale-[0.97]"
                >
                  View Case Study
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
                </MagneticWrap>
                <a
                  href="#how-it-works"
                  className="group inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  How it works
                  <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Live architecture side */}
            <div className="relative border-t border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 p-5 sm:p-8 lg:border-l lg:border-t-0">
              <Deferred className="min-h-[720px] sm:min-h-[650px]">
                <SystemTrace />
              </Deferred>
            </div>
          </div>
        </motion.article>
      </Container>

      <Deferred minHeight={0}>
        <ProjectModal
          project={FEATURED_PROJECT}
          open={open}
          onClose={close}
        />
      </Deferred>
    </section>
  );
}
