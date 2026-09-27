import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, FileDown } from "lucide-react";
import { Container } from "../components/Container";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/Button";
import { SocialLinks } from "../components/SocialLinks";
import { ArchitectureHero } from "../components/ArchitectureHero";
import { AmbientGlow } from "../components/AmbientGlow";
import { MagneticWrap } from "../components/MagneticWrap";
import { usePointerGlow } from "../hooks/usePointerGlow";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFinePointer } from "../hooks/useFinePointer";
import { EASE } from "../lib/motion";
import { PERSONAL, RESUME_PATH } from "../data/site";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const PILLARS = [
  { label: "Backend", color: "#4f46e5" },
  { label: "Distributed Systems", color: "#7c3aed" },
  { label: "AI", color: "#059669" },
];

export function Hero() {
  const { nodeRef: glowRef, onMouseMove: onGlowMove } = usePointerGlow();
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Gentle parallax: the diagram drifts up a touch slower than the page.
  const diagramY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);

  // Mouse parallax (desktop only): three depths — grid, text, system panel.
  const fine = useFinePointer();
  const parallax = fine && !reduced;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 });
  const panelX = useTransform(sx, (v) => v * 6);
  const panelY = useTransform(sy, (v) => v * 6);
  const gridX = useTransform(sx, (v) => v * -10);
  const gridY = useTransform(sy, (v) => v * -10);
  const textX = useTransform(sx, (v) => v * 1.5);
  const textY = useTransform(sy, (v) => v * 1.5);

  const onPointerMove = (e) => {
    if (!parallax) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section ref={sectionRef} id="top" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
      <AmbientGlow variant="hero" />
      <motion.div style={{ x: gridX, y: gridY }} className="grid-fade pointer-events-none absolute -inset-x-4 top-0 -z-10 h-[640px]" />

      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="visible" style={{ x: textX, y: textY }} className="flex min-w-0 flex-col items-start gap-6">
          <motion.div variants={item}>
            <StatusBadge label={PERSONAL.tagline} dotColor="var(--color-indigo)" />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-[var(--color-text)] xs:text-5xl sm:text-6xl xl:text-[4rem]"
          >
            Building <span className="text-gradient-brand">scalable systems</span> with Java.
          </motion.h1>

          {/* Personal brand line — typography, not another card */}
          <motion.p variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:text-[13px]">
            {PILLARS.map((p, i) => (
              <span key={p.label} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-[var(--color-text-faint)]" aria-hidden="true" />}
                <span style={{ color: p.color }}>{p.label}</span>
              </span>
            ))}
          </motion.p>

          <motion.p variants={item} className="max-w-xl text-balance text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            I design Java &amp; Spring Boot microservices — secured with OAuth2, connected through events, and extended with
            generative AI.
          </motion.p>

          <motion.div variants={item} className="flex w-full flex-col gap-3 xs:w-auto sm:flex-row sm:items-center">
            <MagneticWrap className="w-full xs:w-auto">
              <Button href="#project" icon={ArrowRight} className="w-full xs:w-auto">
                View My Work
              </Button>
            </MagneticWrap>
            <MagneticWrap className="w-full xs:w-auto">
              <Button href={RESUME_PATH} download variant="secondary" icon={FileDown} iconPosition="left" className="w-full xs:w-auto">
                Download Resume
              </Button>
            </MagneticWrap>
          </motion.div>

          <motion.div variants={item} className="flex w-full flex-col gap-4 border-t border-[var(--color-border-soft)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-sm font-medium leading-snug text-[var(--color-text-secondary)]">
              <span className="text-gradient-brand font-semibold">“</span>Building systems that are secure, scalable and
              understandable.<span className="text-gradient-brand font-semibold">”</span>
            </p>
            <SocialLinks className="-ml-2.5 sm:ml-0" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: diagramY }} className="min-w-0">
          <motion.div style={{ x: panelX, y: panelY }}>
          <motion.div
            ref={glowRef}
            onMouseMove={onGlowMove}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="pointer-glow card-glow relative rounded-[28px] border border-[var(--color-border)] bg-white/90 p-4 sm:p-6"
          >
            <ArchitectureHero />
          </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
