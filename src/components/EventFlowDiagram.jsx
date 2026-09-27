import { motion } from "framer-motion";
import { EASE, REVEAL } from "../lib/motion";

const STEP_COLORS = ["#64748b", "#3b82f6", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

/**
 * Vertical event pipeline for the case study. Steps reveal in order as the
 * block scrolls into view, then a single packet runs down the rail to show
 * that the chain is asynchronous and one-directional.
 */
export function EventFlowDiagram({ steps }) {
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      className="relative flex flex-col gap-2.5 pl-8"
    >
      <span className="absolute bottom-4 left-[11px] top-4 w-px bg-[linear-gradient(180deg,#cbd5e1,#e2e8f0)]" aria-hidden="true" />
      <motion.span
        aria-hidden="true"
        className="absolute left-[8px] top-4 h-[7px] w-[7px] rounded-full bg-[var(--color-violet)] shadow-[0_0_0_4px_rgba(139,92,246,0.15)]"
        initial={{ opacity: 0 }}
        animate={{ top: ["1rem", "calc(100% - 1.5rem)"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: 1 }}
      />
      {steps.map((step, i) => {
        const color = STEP_COLORS[i % STEP_COLORS.length];
        return (
          <motion.li
            key={step}
            variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}
            className="relative flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5"
          >
            <span className="absolute -left-[26px] h-2.5 w-2.5 rounded-full border-2 bg-white" style={{ borderColor: color }} aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold text-[var(--color-text-faint)]">0{i + 1}</span>
            <span className="font-mono text-sm font-medium text-[var(--color-text)]">{step}</span>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
