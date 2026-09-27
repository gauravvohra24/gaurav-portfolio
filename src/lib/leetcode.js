// Shared LeetCode display helpers.

export const DIFFICULTY = {
  Easy: { color: "#10b981", text: "text-[var(--color-emerald-ink)]", bg: "bg-emerald-50", border: "border-emerald-100" },
  Medium: { color: "#f59e0b", text: "text-[var(--color-amber-ink)]", bg: "bg-amber-50", border: "border-amber-100" },
  Hard: { color: "#f43f5e", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export function timeAgo(iso) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of steps) if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  return "just now";
}
