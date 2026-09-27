import { Suspense } from "react";

/** Suspense boundary that reserves space so the page doesn't jump when a chunk lands. */
export function Deferred({ minHeight, children }) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="w-full animate-pulse rounded-2xl bg-[var(--color-surface-2)]/70" style={{ minHeight }} />}>
      {children}
    </Suspense>
  );
}
