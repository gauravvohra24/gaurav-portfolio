const PALETTE = [
  { text: "text-[var(--color-indigo-ink)]", bg: "bg-indigo-50", border: "border-indigo-100", hover: "hover:shadow-indigo-500/15" },
  { text: "text-[var(--color-violet-ink)]", bg: "bg-violet-50", border: "border-violet-100", hover: "hover:shadow-violet-500/15" },
  { text: "text-[var(--color-blue-ink)]", bg: "bg-blue-50", border: "border-blue-100", hover: "hover:shadow-blue-500/15" },
  { text: "text-[var(--color-cyan-ink)]", bg: "bg-cyan-50", border: "border-cyan-100", hover: "hover:shadow-cyan-500/15" },
  { text: "text-[var(--color-emerald-ink)]", bg: "bg-emerald-50", border: "border-emerald-100", hover: "hover:shadow-emerald-500/15" },
  { text: "text-[var(--color-amber-ink)]", bg: "bg-amber-50", border: "border-amber-100", hover: "hover:shadow-amber-500/15" },
  { text: "text-[var(--color-pink-ink)]", bg: "bg-pink-50", border: "border-pink-100", hover: "hover:shadow-pink-500/15" },
];

function hashIndex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash % PALETTE.length;
}

/**
 * A small colorful technology chip. The same label always maps to the
 * same accent color, so a technology reads consistently across sections.
 */
export function TechBadge({ label, className = "" }) {
  const colors = PALETTE[hashIndex(label)];
  return (
    <span
      className={`rounded-md border ${colors.border} ${colors.bg} px-2.5 py-1 font-mono text-xs font-medium ${colors.text} shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-shadow duration-200 hover:shadow-md ${colors.hover} ${className}`}
    >
      {label}
    </span>
  );
}
