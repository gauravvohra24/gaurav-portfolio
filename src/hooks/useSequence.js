import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Drives a slow, looping "story" animation (request → service → queue → AI)
 * as a single integer step. One small state update per step instead of a
 * constantly re-rendering animation, and it pauses entirely while the
 * element is off-screen or when the visitor prefers reduced motion.
 *
 * Returns `-1` while paused so callers can render a calm, static state.
 */
export function useSequence(stepCount, { interval = 1100, rest = 1, enabled = true } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);
  const running = enabled && inView && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    // `rest` extra idle ticks at the end of each loop so the animation breathes.
    const total = stepCount + rest;
    let current = 0;
    const start = window.setTimeout(() => setStep(0), 0);
    const id = window.setInterval(() => {
      current = (current + 1) % total;
      setStep(current < stepCount ? current : -1);
    }, interval);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
      setStep(-1);
    };
  }, [running, stepCount, interval, rest]);

  return { ref, step: running ? step : -1, running };
}
