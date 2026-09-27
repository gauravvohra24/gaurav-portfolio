import { useRef } from "react";

/**
 * Attaches a cursor-following glow to an element via the `.pointer-glow`
 * CSS utility (index.css), which reads the --px/--py custom properties.
 * Pure CSS custom-property writes — no state, no re-renders.
 */
export function usePointerGlow() {
  const nodeRef = useRef(null);

  const onMouseMove = (e) => {
    const el = nodeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - rect.left}px`);
    el.style.setProperty("--py", `${e.clientY - rect.top}px`);
  };

  return { nodeRef, onMouseMove };
}
