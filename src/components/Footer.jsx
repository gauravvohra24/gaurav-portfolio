import { Mail, Code2, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { Container } from "./Container";
import { PERSONAL, SOCIAL_LINKS } from "../data/site";

const LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS.github, icon: GithubIcon },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: LinkedinIcon },
  { label: "LeetCode", href: SOCIAL_LINKS.leetcode, icon: Code2 },
  { label: "Email", href: SOCIAL_LINKS.email, icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/70">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#6366f1,#8b5cf6,#06b6d4,transparent)] opacity-60" aria-hidden="true" />
      <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-base font-bold tracking-[0.15em] text-[var(--color-text)]">
            GAURAV<span className="text-gradient-brand">.</span>
          </span>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Backend Developer</p>
          <p className="font-mono text-xs leading-relaxed text-[var(--color-text-faint)]">{PERSONAL.stack}</p>
        </div>

        <nav aria-label="Social" className="flex flex-wrap gap-x-5 gap-y-3">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={label === "Email" ? undefined : "_blank"}
              rel={label === "Email" ? undefined : "noreferrer"}
              className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <Icon className="h-4 w-4 transition-colors group-hover:text-[var(--color-indigo-ink)]" />
              {label}
            </a>
          ))}
        </nav>
      </Container>
      <Container className="flex items-center justify-between gap-4 border-t border-[var(--color-border-soft)] py-5">
        <p className="font-mono text-xs text-[var(--color-text-faint)]">
          © {new Date().getFullYear()} {PERSONAL.name}
        </p>
        <a href="#top" className="inline-flex min-h-11 items-center gap-1 font-mono text-xs text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]">
          Back to top
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
        </a>
      </Container>
    </footer>
  );
}
