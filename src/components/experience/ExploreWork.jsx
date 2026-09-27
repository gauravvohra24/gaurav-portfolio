import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Boxes, Database, Rocket } from "lucide-react";
import { FlowChain } from "./FlowChain";
import { WORK_TABS } from "../../data/currentRole";
import { SPRING } from "../../lib/motion";

const TAB_STYLE = {
  identity: { icon: Fingerprint, color: "#8b5cf6" },
  services: { icon: Boxes, color: "#3b82f6" },
  data: { icon: Database, color: "#06b6d4" },
  deployment: { icon: Rocket, color: "#f59e0b" },
};

/** "What I actually built" — four technical lenses on the same work, each with a live mini-diagram. */
export function ExploreWork() {
  const [tab, setTab] = useState(WORK_TABS[0].key);
  const current = WORK_TABS.find((t) => t.key === tab);
  const { color } = TAB_STYLE[tab];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/70 p-4 sm:p-6">
      <div role="tablist" aria-label="Explore my work" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
        {WORK_TABS.map((t) => {
          const isActive = t.key === tab;
          const Icon = TAB_STYLE[t.key].icon;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`work-tab-${t.key}`}
              aria-selected={isActive}
              aria-controls="work-panel"
              onClick={() => setTab(t.key)}
              className={`relative flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 ${
                isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
              }`}
            >
              {isActive && <motion.span layoutId="work-tab-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-[var(--color-border)]" transition={SPRING.soft} />}
              <Icon className="relative h-3.5 w-3.5" style={{ color: isActive ? TAB_STYLE[t.key].color : undefined }} aria-hidden="true" />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${tab}`} className="mt-5 min-h-[150px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">{current.caption}</p>
            <FlowChain nodes={current.chain} running color={color} layout="auto" size="md" interval={800} />
            {current.extra && (
              <div className="flex flex-wrap gap-1.5">
                {current.extra.map((e) => (
                  <span key={e} className="rounded-md border border-dashed border-violet-200 bg-white px-2 py-0.5 font-mono text-[10.5px] text-[var(--color-violet-ink)]">
                    {e}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
