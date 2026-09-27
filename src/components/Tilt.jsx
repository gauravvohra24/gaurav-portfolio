import { forwardRef, useCallback, useRef } from "react";
import { useFinePointer } from "../hooks/useFinePointer";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Card depth: a barely-there tilt (±1.5°) toward the cursor plus a soft
 * gradient that follows it. Writes CSS variables directly — no React state,
 * no re-renders. Inert on touch devices and with reduced motion.
 */
export const Tilt = forwardRef(function Tilt({ as: Tag = "div", max = 1.5, className = "", children, onMouseMove, onMouseLeave, ...rest }, forwardedRef) {
  const localRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const setRef = useCallback(
    (node) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const handleMove = (e) => {
    onMouseMove?.(e);
    const el = localRef.current;
    if (!el || !enabled) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  };

  const handleLeave = (e) => {
    onMouseLeave?.(e);
    const el = localRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Tag ref={setRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`tilt pointer-glow ${className}`} {...rest}>
      {children}
    </Tag>
  );
});
