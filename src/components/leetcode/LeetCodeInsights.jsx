import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Search, SearchX, BarChart3, History } from "lucide-react";
import { EASE, SPRING } from "../../lib/motion";
import { DIFFICULTY, timeAgo } from "../../lib/leetcode";

function DifficultyBadge({ level }) {
  const d = DIFFICULTY[level];
  if (!d) return <span className="text-[11px] text-[var(--color-text-faint)]">Unknown</span>;
  return <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${d.bg} ${d.border} ${d.text}`}>{level}</span>;
}

const Topics = ({ topics, max = 3 }) =>
  topics.length ? (
    <span className="text-[12px] text-[var(--color-text-muted)]">
      {topics.slice(0, max).join(" · ")}
      {topics.length > max && <span className="text-[var(--color-text-faint)]"> +{topics.length - max}</span>}
    </span>
  ) : null;

/** Easy / Medium / Hard with a proportional bar — used inside the stat card. */
export function DifficultyBreakdown({ totals }) {
  return (
    <div className="relative mt-6 w-full max-w-sm">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]" aria-hidden="true">
        {["easy", "medium", "hard"].map((k) => (
          <motion.span
            key={k}
            className="h-full"
            style={{ backgroundColor: DIFFICULTY[k[0].toUpperCase() + k.slice(1)].color }}
            initial={{ width: 0 }}
            animate={{ width: `${(totals[k] / totals.all) * 100}%` }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {["Easy", "Medium", "Hard"].map((level) => (
          <div key={level} className={`rounded-xl border bg-white/80 px-2 py-2 ${DIFFICULTY[level].border}`}>
            <dt className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${DIFFICULTY[level].text}`}>{level}</dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums text-[var(--color-text)]">{totals[level.toLowerCase()]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RecentlySolved({ recent }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
        <History className="h-3.5 w-3.5" aria-hidden="true" />
        Recently solved
      </p>
      <ol className="flex flex-col gap-2">
        {recent.slice(0, 5).map((p, i) => (
          <li key={p.slug}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <span className="mt-0.5 font-mono text-[11px] font-bold text-[var(--color-text-faint)]">{i + 1}.</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-indigo-ink)]">{p.title}</span>
                  <DifficultyBadge level={p.difficulty} />
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2">
                  <Topics topics={p.topics} />
                  <span className="text-[11px] text-[var(--color-text-faint)]">· {timeAgo(p.solvedAt)}</span>
                </span>
              </span>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

const BAR_COLORS = ["#6366f1", "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#8b5cf6", "#3b82f6"];

function TopicBreakdown({ topics }) {
  const top = topics.slice(0, 10);
  const max = top[0]?.solved || 1;
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
        <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
        Problem solving breakdown
      </p>
      <ul className="flex flex-col gap-2">
        {top.map((t, i) => (
          <li key={t.slug} className="grid grid-cols-[minmax(0,10.5rem)_1fr_2.5rem] items-center gap-3">
            <span className="truncate text-[13px] text-[var(--color-text-secondary)]">{t.name}</span>
            <span className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <motion.span
                className="block h-full rounded-full"
                style={{ backgroundColor: BAR_COLORS[i] }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(t.solved / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: EASE }}
              />
            </span>
            <span className="text-right font-mono text-[12px] font-semibold tabular-nums text-[var(--color-text)]">{t.solved}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-[var(--color-text-faint)]">
        Top {top.length} of {topics.length} topics, counted by LeetCode across all solved problems (a problem can have several topics).
      </p>
    </div>
  );
}

function ProblemExplorer({ problems, total }) {
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All Topics");
  const [query, setQuery] = useState("");

  const topicOptions = useMemo(() => {
    const counts = new Map();
    problems.forEach((p) => p.topics.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return ["All Topics", ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)];
  }, [problems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter(
      (p) =>
        (difficulty === "All" || p.difficulty === difficulty) &&
        (topic === "All Topics" || p.topics.includes(topic)) &&
        (!q || p.title.toLowerCase().includes(q) || p.topics.some((t) => t.toLowerCase().includes(q)))
    );
  }, [problems, difficulty, topic, query]);

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--color-border-soft)] pt-5">
      <p className="text-[12px] leading-relaxed text-[var(--color-text-muted)]">
        LeetCode only makes a profile's <span className="font-semibold text-[var(--color-text)]">{problems.length} most recent accepted problems</span> public, so that's what's listed here — the {total}-problem total and topic breakdown above cover everything.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div role="radiogroup" aria-label="Filter by difficulty" className="inline-flex w-fit rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
          {["All", "Easy", "Medium", "Hard"].map((d) => {
            const active = difficulty === d;
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDifficulty(d)}
                className={`relative h-8 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 ${active ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"}`}
              >
                {active && <motion.span layoutId="lc-diff-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-[var(--color-border)]" transition={SPRING.soft} />}
                <span className="relative" style={active && DIFFICULTY[d] ? { color: DIFFICULTY[d].color } : undefined}>
                  {d}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative flex-1">
          <span className="sr-only">Search problems</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems…"
            className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-white pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-indigo)] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
          />
        </label>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Filter by topic">
        {topicOptions.map((t) => {
          const active = topic === t;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTopic(t)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors duration-200 ${
                active ? "border-indigo-200 bg-indigo-50 text-[var(--color-indigo-ink)]" : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)]"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]" aria-live="polite">
        Showing {filtered.length} of {problems.length}
      </p>

      {filtered.length ? (
        <motion.ul layout className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {filtered.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-snug text-[var(--color-text)]">{p.title}</p>
                  <DifficultyBadge level={p.difficulty} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.topics.map((t) => (
                    <span key={t} className="rounded-md bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[11px] text-[var(--color-text-muted)]">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1 pt-1 text-[12px] font-semibold text-[var(--color-indigo-ink)] hover:underline"
                >
                  Open problem
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-8 text-center">
          <SearchX className="h-5 w-5 text-[var(--color-text-faint)]" aria-hidden="true" />
          <p className="text-sm text-[var(--color-text-muted)]">No problems match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setDifficulty("All");
              setTopic("All Topics");
              setQuery("");
            }}
            className="text-[12px] font-semibold text-[var(--color-indigo-ink)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

/** Recently solved + topic analytics + an expandable explorer — all from live data. */
export function LeetCodeInsights({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {data.recent.length ? <RecentlySolved recent={data.recent} /> : <p className="text-sm text-[var(--color-text-muted)]">No recent public submissions.</p>}
        <TopicBreakdown topics={data.topics} />
      </div>

      {data.recent.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="lc-explorer"
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
        >
          {open ? "Hide problems" : "Problems I've Solved"}
          <span className="rounded-md bg-[var(--color-surface-2)] px-1.5 font-mono text-[11px] text-[var(--color-text-muted)]">{data.recent.length}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="lc-explorer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <ProblemExplorer problems={data.recent} total={data.totals.all} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
