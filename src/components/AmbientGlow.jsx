// Each section gets its own faint color "weather". The layers extend past the
// section's edges and fade out, so neighbouring glows overlap and the page
// reads as one continuous surface rather than stacked white rectangles.
// Static radial gradients — no blur filters, no animation, no repaint cost.
const PRESETS = {
  hero: [
    "radial-gradient(ellipse 60% 55% at 85% 20%, rgba(124,58,237,0.10), transparent 70%)",
    "radial-gradient(ellipse 50% 50% at 5% 10%, rgba(79,70,229,0.08), transparent 70%)",
    "radial-gradient(ellipse 45% 40% at 60% 90%, rgba(8,145,178,0.06), transparent 70%)",
  ],
  about: ["radial-gradient(ellipse 55% 60% at 10% 40%, rgba(139,92,246,0.07), transparent 70%)"],
  experience: ["radial-gradient(ellipse 55% 60% at 90% 45%, rgba(59,130,246,0.07), transparent 70%)"],
  project: [
    "radial-gradient(ellipse 50% 50% at 15% 30%, rgba(139,92,246,0.08), transparent 70%)",
    "radial-gradient(ellipse 50% 55% at 90% 70%, rgba(6,182,212,0.08), transparent 70%)",
  ],
  architecture: ["radial-gradient(ellipse 65% 60% at 50% 40%, rgba(59,130,246,0.08), transparent 70%)"],
  skills: [
    "radial-gradient(ellipse 40% 45% at 20% 30%, rgba(245,158,11,0.05), transparent 70%)",
    "radial-gradient(ellipse 40% 45% at 80% 35%, rgba(16,185,129,0.05), transparent 70%)",
    "radial-gradient(ellipse 50% 45% at 50% 85%, rgba(139,92,246,0.05), transparent 70%)",
  ],
  problem: ["radial-gradient(ellipse 50% 55% at 20% 50%, rgba(99,102,241,0.07), transparent 70%)"],
  contact: [
    "radial-gradient(ellipse 50% 55% at 20% 60%, rgba(79,70,229,0.09), transparent 70%)",
    "radial-gradient(ellipse 50% 55% at 85% 45%, rgba(6,182,212,0.08), transparent 70%)",
  ],
};

export function AmbientGlow({ variant = "hero" }) {
  const layers = PRESETS[variant] ?? PRESETS.hero;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 -top-32 -bottom-32 -z-10"
      style={{ backgroundImage: layers.join(",") }}
      aria-hidden="true"
    />
  );
}
