import { useEffect, useRef } from "react";
import { CHAPTERS } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Two soft tints per chapter; registered @property colors (index.css) make the
// change a slow crossfade as one section hands over to the next.
const TINTS = {
  top: ["rgba(124,58,237,0.07)", "rgba(79,70,229,0.05)"],
  about: ["rgba(139,92,246,0.06)", "rgba(99,102,241,0.04)"],
  experience: ["rgba(59,130,246,0.06)", "rgba(99,102,241,0.04)"],
  project: ["rgba(139,92,246,0.06)", "rgba(6,182,212,0.06)"],
  architecture: ["rgba(59,130,246,0.07)", "rgba(99,102,241,0.04)"],
  skills: ["rgba(245,158,11,0.04)", "rgba(16,185,129,0.05)"],
  "problem-solving": ["rgba(99,102,241,0.06)", "rgba(139,92,246,0.04)"],
  contact: ["rgba(79,70,229,0.07)", "rgba(6,182,212,0.07)"],
};
const IDS = CHAPTERS.map((c) => c.id);
const DOT = "99,102,241";

/** Very slow drifting nodes that connect when near — a quiet "network" texture. */
function Particles() {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let points = [];
    let frame = 0;
    let last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 12 : width < 1280 ? 26 : 34;
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const linkDist = width < 768 ? 90 : 130;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(${DOT},${0.08 * (1 - d / linkDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${DOT},0.22)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now) => {
      frame = requestAnimationFrame(step);
      if (now - last < 33) return; // ~30fps is plenty for motion this slow
      last = now;
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }
      draw();
    };

    const start = () => {
      if (!frame && !reduced && !document.hidden) frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        seed();
        draw();
      }, 150);
    };

    seed();
    draw(); // reduced motion: a single static frame
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/**
 * Fixed backdrop behind the whole page: section-aware color wash,
 * a faint engineering grid, and the particle network.
 */
export function BackgroundField() {
  const active = useActiveSection(IDS) ?? "top";
  const [a, b] = TINTS[active] ?? TINTS.top;

  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div className="bg-wash absolute inset-0" style={{ "--bg-a": a, "--bg-b": b }} />
      <div className="bg-grid absolute inset-0" />
      <Particles />
    </div>
  );
}
