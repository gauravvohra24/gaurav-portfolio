import { motion } from "framer-motion";
import { Mail, FileDown, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/icons/BrandIcons";
import { Container } from "../components/Container";
import { ContactForm } from "../components/ContactForm";
import { MagneticWrap } from "../components/MagneticWrap";
import { AmbientGlow } from "../components/AmbientGlow";
import { EASE } from "../lib/motion";
import { SOCIAL_LINKS, PERSONAL, RESUME_PATH, chapter } from "../data/site";

const LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS.github, icon: GithubIcon, external: true },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: LinkedinIcon, external: true },
  { label: "Resume", href: RESUME_PATH, icon: FileDown, download: true },
];

const HEADLINE = ["Let's", "build", "something"];
const LETTER_OFFSETS = HEADLINE.reduce((acc, _w, i) => [...acc, i ? acc[i - 1] + HEADLINE[i - 1].length : 0], []);
const TOTAL_LETTERS = HEADLINE.join("").length;
const letter = {
  hidden: { opacity: 0, y: "0.35em" },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.022, duration: 0.45, ease: EASE } }),
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.25 + i * 0.08, ease: EASE } }),
};

export function Contact() {
  const ch = chapter("contact");

  return (
    <section id="contact" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      <AmbientGlow variant="contact" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="card-glow relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white"
        >
          {/* Thin, slowly moving indigo → violet → cyan line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="animated-gradient-bar absolute inset-x-0 top-0 h-[3px] origin-left"
          />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12),transparent_70%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" aria-hidden="true" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative grid grid-cols-1 gap-10 p-6 sm:p-12 lg:grid-cols-[1fr_1fr] lg:gap-14"
          >
            <div className="flex flex-col gap-6">
              <motion.p custom={0} variants={reveal} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {ch.index} / {ch.label}
                </span>
                <span className="h-px w-6 bg-[linear-gradient(90deg,var(--color-indigo),transparent)]" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--color-text-faint)]">{ch.story}</span>
              </motion.p>
              <h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl" aria-label="Let's build something meaningful.">
                {HEADLINE.map((word, wi) => (
                  <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
                    {[...word].map((ch, ci) => (
                      <motion.span key={ci} custom={LETTER_OFFSETS[wi] + ci} variants={letter} className="inline-block">
                        {ch}
                      </motion.span>
                    ))}
                    &nbsp;
                  </span>
                ))}
                {/* the payoff word wipes in as one gradient piece */}
                <motion.span
                  aria-hidden="true"
                  className="text-gradient-brand inline-block"
                  variants={{
                    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
                    visible: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { delay: 0.3 + TOTAL_LETTERS * 0.022, duration: 0.7, ease: EASE } },
                  }}
                >
                  meaningful.
                </motion.span>
              </h2>
              <motion.p custom={2} variants={reveal} className="max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
                I'm interested in backend engineering, distributed systems and products that solve meaningful problems.
              </motion.p>

              <motion.div custom={3} variants={reveal} className="self-start">
              <MagneticWrap className="w-full xs:w-auto">
              <a
                href={SOCIAL_LINKS.email}
                className="glow-btn group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#6366f1,#8b5cf6_60%,#06b6d4_130%)] bg-[length:180%_100%] bg-[position:0%_0%] px-6 text-sm font-semibold text-white transition-all duration-500 hover:bg-[position:100%_0%] xs:w-auto"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email Me
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              </MagneticWrap>
              </motion.div>

              <motion.div custom={4} variants={reveal} className="grid grid-cols-3 gap-2 sm:max-w-md">
                {LINKS.map(({ label, href, icon: Icon, external, download }) => (
                  <MagneticWrap key={label} className="w-full">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    download={download || undefined}
                    className="card-lift flex w-full flex-col items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-2 py-3 text-xs font-semibold text-[var(--color-text)] hover:border-indigo-200"
                  >
                    <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                    {label}
                  </a>
                  </MagneticWrap>
                ))}
              </motion.div>

              <motion.p custom={5} variants={reveal} className="text-sm text-[var(--color-text-faint)]">
                {PERSONAL.email} · {PERSONAL.location}
              </motion.p>
            </div>

            <motion.div custom={3} variants={reveal} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/70 p-5 sm:p-7">
              <ContactForm />
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
