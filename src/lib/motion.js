// Shared motion vocabulary so every animation on the page feels related.
//
// Three levels:
//   MICRO   — buttons, icons, nav, chips          150–250ms
//   SECTION — cards / diagrams entering viewport   400–800ms
//   SYSTEM  — hero + architecture "living system"  slow, continuous, calm
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = { micro: 0.2, section: 0.6, system: 1.4 };

export const SPRING = {
  micro: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 },
  soft: { type: "spring", bounce: 0.18, duration: 0.55 },
};




/**
 * Viewport rule for every "reveal once" animation.
 * - amount 0: never depends on element height (a 5000px-tall card on a phone
 *   can't have 15% of itself on screen at once, so it would never appear).
 * - huge top margin: anything ABOVE the screen counts as seen, however far a
 *   fast fling or anchor jump skipped — content you've passed is never left invisible.
 * - bottom -6%: entrance still plays as content scrolls in, not before.
 */
export const REVEAL = { once: true, amount: 0, margin: "40000px 0px -6% 0px" };

/**
 * Turns a polyline into framer-motion keyframes for an SVG packet, with
 * timing proportional to segment length so the packet moves at a constant speed.
 */
export function polylineKeyframes(points) {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(x2 - x1, y2 - y1));
  }
  const total = lengths[lengths.length - 1] || 1;
  return {
    cx: points.map((p) => p[0]),
    cy: points.map((p) => p[1]),
    times: lengths.map((l) => l / total),
  };
}

// Packet palette — one color per kind of traffic, used by every diagram.
export const PACKET = {
  request: { color: "#6366f1", label: "Request" },
  auth: { color: "#8b5cf6", label: "Auth" },
  data: { color: "#06b6d4", label: "Data" },
  event: { color: "#f59e0b", label: "Event" },
  ai: { color: "#10b981", label: "AI response" },
};
