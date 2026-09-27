import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const NODES = [
  { id: "api", x: 100, y: 20, label: "API" },
  { id: "services", x: 40, y: 80, label: "SERVICES" },
  { id: "database", x: 160, y: 80, label: "DATABASE" },
  { id: "ai", x: 100, y: 130, label: "AI" },
];

const EDGES = [
  ["api", "services"],
  ["api", "database"],
  ["services", "ai"],
  ["database", "ai"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const SESSION_KEY = "gv-intro-seen";

function readSeen() {
  try {
    return typeof window !== "undefined" && Boolean(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

/**
 * A short, skippable cinematic loading sequence shown once per browser
 * session: a point expands into a tiny network, labels itself, then
 * dissolves so the real hero can take over.
 */
export function IntroSequence({ onDone }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState("point"); // point -> network -> labels -> exit -> done
  const [skip, setSkip] = useState(false);

  const alreadySeen = readSeen();
  const shouldPlay = !reduced && !alreadySeen && !skip;

  useEffect(() => {
    if (!shouldPlay) {
      onDone();
      return undefined;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable (private mode / blocked site data) — the intro just plays again next time
    }
    const timers = [
      setTimeout(() => setPhase("network"), 150),
      setTimeout(() => setPhase("labels"), 450),
      setTimeout(() => setPhase("exit"), 750),
      setTimeout(() => onDone(), 1100),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  useEffect(() => {
    if (!shouldPlay) return undefined;
    const dismiss = () => setSkip(true);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--color-ink)]"
        aria-hidden="true"
      >
          <div className="grid-fade pointer-events-none absolute inset-0 opacity-60" />
          <svg viewBox="0 0 200 150" className="relative h-40 w-52">
            <motion.circle
              cx="100"
              cy="75"
              r="4"
              fill="#6366f1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: phase === "point" ? 1 : 0, scale: phase === "point" ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            />

            {phase !== "point" &&
              EDGES.map(([a, b]) => (
                <motion.line
                  key={`${a}-${b}`}
                  x1={byId[a].x}
                  y1={byId[a].y}
                  x2={byId[b].x}
                  y2={byId[b].y}
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 0.4 }}
                />
              ))}

            {phase !== "point" &&
              NODES.map((node, i) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <circle cx={node.x} cy={node.y} r="4.5" fill="#06b6d4" />
                  {phase === "labels" && (
                    <motion.text
                      x={node.x}
                      y={node.y - 12}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="var(--font-mono)"
                      fill="#4f46e5"
                      initial={{ opacity: 0, y: node.y - 8 }}
                      animate={{ opacity: 1, y: node.y - 12 }}
                      transition={{ duration: 0.3 }}
                    >
                      {node.label}
                    </motion.text>
                  )}
                </motion.g>
              ))}
          </svg>
      </motion.div>
    </AnimatePresence>
  );
}
