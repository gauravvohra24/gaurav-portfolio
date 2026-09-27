import { motion } from "framer-motion";
import { Server, Network, ShieldCheck, Waypoints, Sparkles, Database, Wrench, LayoutPanelLeft } from "lucide-react";
import { Tilt } from "./Tilt";
import { EASE, DURATION, REVEAL } from "../lib/motion";

const ICONS = { Server, Network, ShieldCheck, Waypoints, Sparkles, Database, Wrench, LayoutPanelLeft };

const ACCENTS = {
  indigo: { color: "#6366f1", bg: "bg-indigo-50", text: "text-[var(--color-indigo-ink)]", hover: "hover:border-indigo-200" },
  violet: { color: "#8b5cf6", bg: "bg-violet-50", text: "text-[var(--color-violet-ink)]", hover: "hover:border-violet-200" },
  blue: { color: "#3b82f6", bg: "bg-blue-50", text: "text-[var(--color-blue-ink)]", hover: "hover:border-blue-200" },
  cyan: { color: "#06b6d4", bg: "bg-cyan-50", text: "text-[var(--color-cyan-ink)]", hover: "hover:border-cyan-200" },
  emerald: { color: "#10b981", bg: "bg-emerald-50", text: "text-[var(--color-emerald-ink)]", hover: "hover:border-emerald-200" },
  amber: { color: "#f59e0b", bg: "bg-amber-50", text: "text-[var(--color-amber-ink)]", hover: "hover:border-amber-200" },
  pink: { color: "#ec4899", bg: "bg-pink-50", text: "text-[var(--color-pink-ink)]", hover: "hover:border-pink-200" },
  slate: { color: "#64748b", bg: "bg-slate-100", text: "text-slate-500", hover: "hover:border-slate-300" },
};

/** A skill category styled as a system module: header, status LED, and its "ports" (tags). */
export function TechCard({ group, index }) {
  const Icon = ICONS[group.icon] ?? Server;
  const accent = ACCENTS[group.accent] ?? ACCENTS.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL}
      transition={{ duration: DURATION.section, delay: (index % 4) * 0.06, ease: EASE }}
    >
      <Tilt
        style={{ "--glow": `${accent.color}14` }}
        className={`group relative h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-5 ${accent.hover}`}
      >
        {/* top border that travels across on hover */}
        <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden" aria-hidden="true">
          <span
            className="block h-full w-1/2 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[200%]"
            style={{ background: `linear-gradient(90deg, transparent, ${accent.color}, transparent)` }}
          />
        </span>
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.bg} transition-[transform,border-radius] duration-300 group-hover:rotate-[-8deg] group-hover:rounded-[14px]`}>
            <Icon className={`h-4 w-4 ${accent.text}`} aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-[var(--color-text)]">{group.title}</h3>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-text-faint)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-60 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
            {String(group.items.length).padStart(2, "0")}
          </span>
        </div>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {group.items.map((item, i) => (
            <li
              key={item}
              className="rounded-md border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[12px] text-[var(--color-text-muted)] transition-[transform,border-color,color] duration-200 ease-out group-hover:-translate-y-[3px] group-hover:text-[var(--color-text-secondary)]"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </Tilt>
    </motion.div>
  );
}
