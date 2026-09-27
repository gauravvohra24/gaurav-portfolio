export function StatusBadge({ label, dotColor = "var(--color-emerald)" }) {
  return (
    <div className="glass inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] py-1.5 pl-2.5 pr-4">
      <span className="relative flex h-2 w-2" style={{ color: dotColor }}>
        <span className="dot-pulse absolute inline-flex h-full w-full" />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}
