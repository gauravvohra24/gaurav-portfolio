import { Suspense } from "react";

/**
 * Suspense boundary that reserves space so the page doesn't jump when a chunk lands.
 * Pass per-breakpoint min-h-* classes matching the real rendered height — a
 * too-small placeholder makes everything below shift (and anchor jumps miss).
 */
export function Deferred({ minHeight, className = "", children }) {
  return (
    <Suspense fallback={<div aria-hidden="true" className={`w-full animate-pulse rounded-2xl bg-[var(--color-surface-2)]/70 ${className}`} style={minHeight ? { minHeight } : undefined} />}>
      {children}
    </Suspense>
  );
}
