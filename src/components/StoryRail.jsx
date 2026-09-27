import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { CHAPTERS } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";

const RAIL = CHAPTERS.filter((c) => c.id !== "top");
const IDS = CHAPTERS.map((c) => c.id);
const GAP = 26; // px between rail points

/**
 * Desktop story rail. The fill line tracks scroll continuously; a single
 * glowing marker glides to the active chapter; completed chapters stay lit.
 * The chapter label appears beside the marker whenever the chapter changes
 * (and stays on very wide screens where there's room for it).
 */
export function StoryRail() {
  const activeId = useActiveSection(IDS) ?? "top";
  const activeIndex = RAIL.findIndex((c) => c.id === activeId); // -1 while in the hero
  const active = activeIndex >= 0 ? RAIL[activeIndex] : null;
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Flash the label for a moment after each chapter change.
  const [flash, setFlash] = useState(false);
  const timer = useRef(0);
  useEffect(() => {
    if (!active) return undefined;
    const show = setTimeout(() => setFlash(true), 0);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 2200);
    return () => clearTimeout(show);
  }, [active]);

  const height = (RAIL.length - 1) * GAP;

  return (
    <nav aria-label="Story progress" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative" style={{ height }}>
        <span className="absolute left-[3.5px] top-0 w-px bg-[var(--color-border)]" style={{ height }} aria-hidden="true" />
        <motion.span
          aria-hidden="true"
          className="absolute left-[3.5px] top-0 w-px origin-top bg-[linear-gradient(180deg,#6366f1,#8b5cf6,#06b6d4)]"
          style={{ height, scaleY: fill }}
        />

        {RAIL.map((c, i) => {
          const done = activeIndex >= 0 && i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-label={`${c.index} ${c.label}`}
              aria-current={isActive ? "step" : undefined}
              className="group absolute left-0 flex -translate-y-1/2 items-center"
              style={{ top: i * GAP }}
            >
              <span
                className={`block h-2 w-2 rounded-full border transition-all duration-300 ${
                  done || isActive ? "border-[var(--color-indigo)] bg-[var(--color-indigo)]" : "border-[var(--color-text-faint)] bg-white group-hover:border-[var(--color-indigo)]"
                } ${done ? "opacity-60" : ""}`}
              />
              <span className="pointer-events-none ml-3 whitespace-nowrap rounded-md bg-white/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                {c.index} {c.label}
              </span>
            </a>
          );
        })}

        {/* Travelling marker */}
        {active && (
          <motion.div
            className="pointer-events-none absolute left-0 flex -translate-y-1/2 items-center"
            initial={false}
            animate={{ top: activeIndex * GAP }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            <span className="relative -ml-[4px] flex h-4 w-4 items-center justify-center">
              <span className="dot-pulse absolute inset-0 rounded-full text-indigo-400" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[linear-gradient(140deg,#6366f1,#8b5cf6)] shadow-[0_0_0_4px_rgba(99,102,241,0.15)]" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.25 }}
                className={`ml-2.5 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-white/90 px-2 py-1 shadow-sm backdrop-blur transition-opacity duration-500 min-[1680px]:opacity-100 ${
                  flash ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-indigo-ink)]">
                  {active.index} {active.label}
                </span>
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
