import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, RefreshCw, ShieldCheck } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { AmbientGlow } from "../components/AmbientGlow";
import { Tilt } from "../components/Tilt";
import { ChangeDiagram, RetryDiagram, LayersDiagram } from "../components/PrincipleDiagrams";
import { useFinePointer } from "../hooks/useFinePointer";
import { EASE, DURATION, REVEAL } from "../lib/motion";
import { PERSONAL } from "../data/site";

const PRINCIPLES = [
  {
    icon: RefreshCw,
    title: "Design for change.",
    body: "Services split by responsibility, so one can evolve without breaking the rest.",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.09)",
    text: "text-[var(--color-indigo-ink)]",
    bg: "bg-indigo-50",
    hover: "hover:border-indigo-200",
    activeBorder: "border-indigo-200",
    Diagram: ChangeDiagram,
    iconMotion: "group-hover:rotate-180 group-data-[active=true]:rotate-180",
  },
  {
    icon: ShieldCheck,
    title: "Build for reliability.",
    body: "Security at the edge and async messaging keep slow or failing work isolated.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.09)",
    text: "text-[var(--color-cyan-ink)]",
    bg: "bg-cyan-50",
    hover: "hover:border-cyan-200",
    activeBorder: "border-cyan-200",
    Diagram: RetryDiagram,
    iconMotion: "group-hover:scale-110 group-data-[active=true]:scale-110",
  },
  {
    icon: Compass,
    title: "Keep systems understandable.",
    body: "Clear layers, validated APIs and one place for every concern.",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.09)",
    text: "text-[var(--color-violet-ink)]",
    bg: "bg-violet-50",
    hover: "hover:border-violet-200",
    activeBorder: "border-violet-200",
    Diagram: LayersDiagram,
    iconMotion: "group-hover:-rotate-45 group-data-[active=true]:-rotate-45",
  },
];

export function About() {
  const [active, setActive] = useState(null);
  const fine = useFinePointer();

  return (
    <section id="about" className="relative py-16 sm:py-24">
      <AmbientGlow variant="about" />
      <Container className="flex flex-col gap-10">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <SectionHeading chapter="about" title="Engineering with systems in mind." />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL}
            transition={{ duration: DURATION.section, delay: 0.15, ease: EASE }}
            className="flex flex-col gap-4"
          >
            <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-[17px]">
              I'm a backend developer who builds distributed systems with{" "}
              <span className="font-medium text-[var(--color-text)]">Spring Boot and Spring Cloud</span> — services that
              discover each other, share configuration, stay secure at the gateway and talk through events when work
              shouldn't block a request. Today I'm a{" "}
              <span className="font-medium text-[var(--color-text)]">Software Engineer Trainee at VVDN</span>, owning backend
              services for a School Management System built for Nepal.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
              {PERSONAL.location} · Java · Spring · Distributed systems
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, body, color, glow, text, bg, hover, activeBorder, Diagram, iconMotion }, i) => {
            // Desktop: hover drives it. Touch: tap toggles; the first card starts active so there's always motion to see.
            const isActive = active === i || (!fine && active === null && i === 0);
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL}
                transition={{ duration: DURATION.section, delay: i * 0.1, ease: EASE }}
              >
                <Tilt
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${title} ${body}`}
                  data-active={isActive}
                  onMouseEnter={() => fine && setActive(i)}
                  onMouseLeave={() => fine && setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => !fine && setActive((cur) => (cur === i ? null : i))}
                  style={{ "--glow": glow }}
                  className={`group relative h-full overflow-hidden rounded-2xl border bg-white p-6 text-left outline-none ${hover} ${isActive ? activeBorder : "border-[var(--color-border)]"}`}
                >
                  {/* accent rail that grows when active */}
                  <span
                    className={`absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500 ease-out ${isActive ? "scale-x-100" : "scale-x-[0.18]"}`}
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                      <Icon className={`h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${text} ${iconMotion}`} aria-hidden="true" />
                    </span>
                    <span className={`font-mono text-sm font-bold transition-colors duration-300 ${isActive ? "" : "text-[var(--color-border)]"}`} style={isActive ? { color } : undefined}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--color-text)]">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{body}</p>

                  <div
                    className={`mt-5 h-[78px] rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-2 transition-[opacity,filter] duration-500 ${
                      isActive ? "opacity-100 grayscale-0" : "opacity-45 grayscale"
                    }`}
                  >
                    <Diagram active={isActive} color={color} />
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
