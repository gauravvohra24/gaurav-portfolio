import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { AmbientGlow } from "../components/AmbientGlow";
import { PROBLEM_SOLVING, ENGINEERING_DNA } from "../data/skills";
import { SOCIAL_LINKS } from "../data/site";
import { useCountUp } from "../hooks/useCountUp";
import { EASE } from "../lib/motion";

// Decorative algorithm vignettes — they animate concepts, not claims.
// Each runs on a shared 6s cycle; staggered delays make the "algorithm" step through.
const d = (i, step = 0.35) => ({ animationDelay: `${i * step}s` });

function ArrayGlyph() {
  return (
    <svg viewBox="0 0 110 24" className="h-6 w-[100px]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={1 + i * 18} y="2" width="16" height="20" rx="3" fill="none" stroke="#c7d2fe" strokeWidth="1.2" />
      ))}
      {/* sliding window */}
      <rect className="algo-slide" x="0" y="0" width="36" height="24" rx="4" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1.3" />
    </svg>
  );
}
function TreeGlyph() {
  const nodes = [[30, 8], [15, 22], [8, 36], [22, 36], [45, 22]]; // DFS order
  return (
    <svg viewBox="0 0 60 44" className="h-11 w-16" fill="none" strokeWidth="1.2">
      <path d="M30 8 L15 22 M30 8 L45 22 M15 22 L8 36 M15 22 L22 36" stroke="#a7f3d0" />
      {nodes.map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#fff" stroke="#10b981" className="algo-node" style={{ ...d(i, 0.45), "--algo": "#10b981" }} />
      ))}
    </svg>
  );
}
function GraphGlyph() {
  const edges = ["M8 10 L30 6", "M8 10 L12 32", "M30 6 L52 18", "M30 6 L36 38", "M12 32 L36 38", "M52 18 L36 38"]; // BFS from top-left
  return (
    <svg viewBox="0 0 60 44" className="h-11 w-16" fill="none" strokeWidth="1.3">
      {edges.map((e, i) => (
        <g key={e}>
          <path d={e} stroke="#cffafe" />
          <path d={e} stroke="#06b6d4" pathLength="1" className="algo-edge" style={d(i, 0.4)} />
        </g>
      ))}
      {[[8, 10], [30, 6], [52, 18], [36, 38], [12, 32]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.4" fill="#fff" stroke="#06b6d4" />
      ))}
    </svg>
  );
}
function DpGlyph() {
  return (
    <svg viewBox="0 0 44 44" className="h-11 w-11">
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={1 + c * 14} y={1 + r * 14} width="13" height="13" rx="2" fill="#fff" stroke="#8b5cf6" strokeWidth="1" className="algo-node" style={{ ...d(r + c, 0.5), "--algo": "#ddd6fe" }} />
        ))
      )}
    </svg>
  );
}

const GLYPHS = [
  { label: "Arrays", Glyph: ArrayGlyph, pos: "left-5 top-5 sm:left-7 sm:top-7", delay: "0s" },
  { label: "Trees", Glyph: TreeGlyph, pos: "right-5 top-5 sm:right-7 sm:top-6", delay: "-2s" },
  { label: "Graphs", Glyph: GraphGlyph, pos: "left-5 bottom-5 sm:left-7 sm:bottom-6", delay: "-4s" },
  { label: "DP", Glyph: DpGlyph, pos: "right-5 bottom-5 sm:right-7 sm:bottom-7", delay: "-1s" },
];

const DNA_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"];

export function ProblemSolving() {
  const { ref, value } = useCountUp(PROBLEM_SOLVING.target);
  const sceneRef = useRef(null);
  const sceneInView = useInView(sceneRef);

  return (
    <section id="problem-solving" className="relative py-16 sm:py-24">
      <AmbientGlow variant="problem" />
      <Container className="flex flex-col gap-10">
        <SectionHeading chapter="problem-solving" title="Sharpening the fundamentals." />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LeetCode stat */}
          <motion.a
            ref={ref}
            href={SOCIAL_LINKS.leetcode}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="card-lift card-glow group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white px-6 py-16 text-center"
          >
            <div className="grid-fade pointer-events-none absolute inset-0 opacity-80" style={{ maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)" }} aria-hidden="true" />
            <div ref={sceneRef} className={`pointer-events-none absolute inset-0 ${sceneInView ? "" : "algo-paused"}`} aria-hidden="true">
            {GLYPHS.map(({ label, Glyph, pos, delay }) => (
              <div key={label} className={`float-y pointer-events-none absolute flex flex-col items-center gap-1 opacity-60 transition-opacity duration-500 group-hover:opacity-95 ${pos}`} style={{ animationDelay: delay }} aria-hidden="true">
                <Glyph />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">{label}</span>
              </div>
            ))}
            </div>

            <span className="relative flex items-baseline">
              <span className="text-gradient-brand text-7xl font-extrabold tabular-nums tracking-[-0.04em] sm:text-8xl">{value}</span>
              <span className="text-gradient-brand text-5xl font-extrabold sm:text-6xl">{PROBLEM_SOLVING.suffix}</span>
            </span>
            <span className="relative mt-2 flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
              <Code2 className="h-4 w-4 text-[var(--color-indigo-ink)]" aria-hidden="true" />
              {PROBLEM_SOLVING.label}
            </span>
            <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3.5 py-1.5 text-sm font-semibold text-[var(--color-indigo-ink)] transition-colors group-hover:bg-indigo-100/70">
              View LeetCode profile
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </motion.a>

          {/* Engineering DNA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-2)]/70 p-5 sm:p-6"
          >
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h3 className="text-lg font-bold tracking-tight text-[var(--color-text)]">Engineering DNA</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">What I bring</span>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              {ENGINEERING_DNA.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                  className="card-lift group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold" style={{ color: DNA_COLORS[i] }}>
                      0{i + 1}
                    </span>
                    <span className="h-px flex-1 origin-left scale-x-50 transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: `${DNA_COLORS[i]}55` }} />
                  </div>
                  <p className="text-[15px] font-semibold tracking-tight text-[var(--color-text)]">{item.title}</p>
                  <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
