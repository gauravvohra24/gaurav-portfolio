// Central color-by-category mapping so the architecture diagram, the
// featured project visualization, and the skills cards all agree on
// which accent represents which kind of system component.
//
// text / bg / border are Tailwind arbitrary-value fragments; dot is a
// literal hex used for small inline indicators (SVG strokes, glow ring).

export const CATEGORY_COLORS = {
  edge: {
    text: "text-[var(--color-indigo-ink)]",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    hoverBorder: "hover:border-indigo-200",
    ring: "shadow-indigo-500/20",
    dot: "#6366f1",
  },
  security: {
    text: "text-[var(--color-violet-ink)]",
    bg: "bg-violet-50",
    border: "border-violet-200",
    hoverBorder: "hover:border-violet-200",
    ring: "shadow-violet-500/20",
    dot: "#8b5cf6",
  },
  service: {
    text: "text-[var(--color-blue-ink)]",
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-200",
    ring: "shadow-blue-500/20",
    dot: "#3b82f6",
  },
  messaging: {
    text: "text-[var(--color-amber-ink)]",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-200",
    ring: "shadow-amber-500/20",
    dot: "#f59e0b",
  },
  data: {
    text: "text-[var(--color-cyan-ink)]",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    hoverBorder: "hover:border-cyan-200",
    ring: "shadow-cyan-500/20",
    dot: "#06b6d4",
  },
  ai: {
    text: "text-[var(--color-emerald-ink)]",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-200",
    ring: "shadow-emerald-500/20",
    dot: "#10b981",
  },
  platform: {
    text: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    hoverBorder: "hover:border-slate-200",
    ring: "shadow-slate-400/20",
    dot: "#64748b",
  },
};
