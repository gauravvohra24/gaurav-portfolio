import { motion } from "framer-motion";
import { EASE, REVEAL } from "../lib/motion";
import { chapter as getChapter } from "../data/site";

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: EASE } }),
};

/**
 * Section header that carries the page's story: a chapter index + the
 * one-line narrative ("Here's how I think."), then the section's headline.
 * The story line lands first and the title follows, so each section reads
 * as the next beat rather than an isolated block.
 */
export function SectionHeading({ chapter, eyebrow, title, description, align = "left", className = "" }) {
  const ch = chapter ? getChapter(chapter) : null;
  const alignClasses = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL}
      className={`flex max-w-2xl flex-col gap-3 ${alignClasses} ${className}`}
    >
      <motion.p custom={0} variants={reveal} className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {ch ? `${ch.index} / ${eyebrow ?? ch.label}` : eyebrow}
        </span>
        {ch && (
          <>
            <span className="h-px w-6 bg-[linear-gradient(90deg,var(--color-indigo),transparent)]" aria-hidden="true" />
            <span className="text-sm font-medium text-[var(--color-text-faint)]">{ch.story}</span>
          </>
        )}
      </motion.p>
      <motion.h2
        custom={1}
        variants={reveal}
        className="text-balance text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-[2.6rem] sm:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p custom={2} variants={reveal} className="text-balance text-base leading-relaxed text-[var(--color-text-muted)]">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
