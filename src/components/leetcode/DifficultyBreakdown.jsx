import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import { DIFFICULTY } from "../../lib/leetcode";

/** Easy / Medium / Hard with a proportional bar — used inside the stat card. */
export function DifficultyBreakdown({ totals }) {
  return (
    <div className="relative mt-6 w-full max-w-sm">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]" aria-hidden="true">
        {["easy", "medium", "hard"].map((k) => (
          <motion.span
            key={k}
            className="h-full"
            style={{ backgroundColor: DIFFICULTY[k[0].toUpperCase() + k.slice(1)].color }}
            initial={{ width: 0 }}
            animate={{ width: `${(totals[k] / totals.all) * 100}%` }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {["Easy", "Medium", "Hard"].map((level) => (
          <div key={level} className={`rounded-xl border bg-white/80 px-2 py-2 ${DIFFICULTY[level].border}`}>
            <dt className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${DIFFICULTY[level].text}`}>{level}</dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums text-[var(--color-text)]">{totals[level.toLowerCase()]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
