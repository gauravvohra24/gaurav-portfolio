import { Mail, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { SOCIAL_LINKS } from "../data/site";

const LINKS = [
  { key: "github", href: SOCIAL_LINKS.github, label: "GitHub", icon: GithubIcon },
  { key: "linkedin", href: SOCIAL_LINKS.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { key: "leetcode", href: SOCIAL_LINKS.leetcode, label: "LeetCode", icon: Code2 },
  { key: "email", href: SOCIAL_LINKS.email, label: "Email", icon: Mail },
];

export function SocialLinks({ className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LINKS.map(({ key, href, label, icon: Icon }) => (
        <a
          key={key}
          href={href}
          target={key === "email" ? undefined : "_blank"}
          rel={key === "email" ? undefined : "noreferrer"}
          aria-label={label}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]"
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
