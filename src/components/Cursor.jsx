import { useEffect, useRef } from "react";
import { useFinePointer } from "../hooks/useFinePointer";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Desktop-only cursor enhancement layered over the native pointer:
 *   default     → a small dot
 *   interactive → the dot swells into a soft halo
 *   [data-cursor="ring"] (architecture nodes) → a thin inspection ring
 *   text fields → hidden, so the I-beam stays clean
 * Positions are written straight to transforms; the rAF loop only runs while
 * the ring is still catching up, so it's idle when the mouse is still.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!fine || reduced) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;

    const tick = () => {
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      document.documentElement.dataset.cursorVisible = "true";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, [role='button'], input, textarea, select, label");
      let mode = "default";
      if (target) {
        if (target.dataset.cursor) mode = target.dataset.cursor;
        else if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) mode = "text";
        else mode = "link";
      }
      ring.dataset.mode = mode;
      dot.dataset.mode = mode;
    };

    const onLeave = () => {
      document.documentElement.dataset.cursorVisible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.cursorVisible;
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-mode="default" aria-hidden="true">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot" data-mode="default" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
