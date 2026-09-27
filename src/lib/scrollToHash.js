// In-page navigation that still lands on target when content above it changes
// height mid-scroll (deferred chunks mounting, live LeetCode data replacing its
// skeleton). Scroll once, wait for it to settle, then correct if the target moved.
export function scrollToHash(hash, { delay = 0 } = {}) {
  const el = document.getElementById(hash.slice(1));
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = (behavior) => el.scrollIntoView({ behavior, block: "start" });

  window.setTimeout(() => {
    go(reduced ? "auto" : "smooth");
    history.replaceState(null, "", hash);

    // Stop correcting the moment the visitor takes over.
    let cancelled = false;
    const cancel = () => (cancelled = true);
    const opts = { once: true, passive: true };
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("keydown", cancel, opts);

    let lastY = -1;
    let stableFrames = 0;
    let corrections = 0;
    const settle = () => {
      if (cancelled) return;
      const y = window.scrollY;
      stableFrames = Math.abs(y - lastY) < 1 ? stableFrames + 1 : 0;
      lastY = y;
      if (stableFrames < 8) return requestAnimationFrame(settle); // ~130ms without movement
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const off = el.getBoundingClientRect().top - margin;
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 2;
      if (Math.abs(off) > 4 && !(off > 0 && atBottom) && corrections++ < 4) {
        go("auto");
        stableFrames = 0;
        requestAnimationFrame(settle);
        return;
      }
      holdUntil ??= performance.now() + 1500;
      if (performance.now() < holdUntil) requestAnimationFrame(settle); // keep watching briefly for late layout changes
    };
    let holdUntil = null;
    requestAnimationFrame(settle);
  }, delay);
}
