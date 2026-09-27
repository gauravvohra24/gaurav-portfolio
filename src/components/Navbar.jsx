import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, FileDown } from "lucide-react";
import { GithubIcon } from "./icons/BrandIcons";
import { CHAPTERS, NAV_LINKS, PERSONAL, RESUME_PATH, SOCIAL_LINKS } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));
const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const chapterId = useActiveSection(CHAPTER_IDS);
  const chapter = CHAPTERS.find((c) => c.id === chapterId && c.id !== "top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={`glass relative w-full overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "max-w-4xl border-[var(--color-border)] shadow-[0_10px_34px_-14px_rgba(15,23,42,0.22)]"
            : "max-w-5xl border-transparent shadow-[0_2px_10px_-6px_rgba(15,23,42,0.06)]"
        }`}
      >
        {/* Reading progress — a hairline that fills as the story advances */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)] opacity-70"
        />
        <nav
          className={`flex items-center justify-between px-4 transition-all duration-300 sm:px-5 ${scrolled ? "h-14" : "h-16"}`}
          aria-label="Primary"
        >
          <a
            href="#top"
            className="font-mono text-sm font-semibold tracking-[0.15em] text-[var(--color-text)]"
            aria-label={`${PERSONAL.name} — home`}
          >
            GAURAV<span className="text-gradient-brand">.</span>
          </a>

          {/* Mobile section indicator */}
          <div className="mr-auto ml-3 flex h-6 items-center overflow-hidden md:hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {chapter && scrolled && (
                <motion.span
                  key={chapter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
                >
                  <span className="text-[var(--color-indigo-ink)]">{chapter.index}</span>
                  {chapter.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeId === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
                      isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(120deg,#eef2ff,#f3e8ff)] shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)]"
                        transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-indigo)]"
            >
              <GithubIcon className="h-[17px] w-[17px]" aria-hidden="true" />
            </a>
            <a
              href={RESUME_PATH}
              download
              className="gradient-border inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              Resume
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text)] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      // Close first, then scroll ourselves: the collapsing menu cancels the native hash jump on mobile.
                      e.preventDefault();
                      setMenuOpen(false);
                      const target = document.getElementById(link.href.slice(1));
                      // Wait for the menu's 250ms collapse to finish — scrolling during it gets cancelled.
                      window.setTimeout(() => {
                        target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                        history.replaceState(null, "", link.href);
                      }, 280);
                    }}
                    className="rounded-lg px-3 py-3 text-base text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)]"
                    aria-label="GitHub profile"
                  >
                    <GithubIcon className="h-[18px] w-[18px]" />
                  </a>
                  <a
                    href={RESUME_PATH}
                    download
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(120deg,#6366f1,#8b5cf6)] px-4 text-sm font-semibold text-white"
                  >
                    <FileDown className="h-4 w-4" />
                    Download Resume
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
