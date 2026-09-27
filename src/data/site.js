// Central place for personal / contact constants.
// Replace the TODO values with your real profile URLs when ready —
// nothing else in the codebase needs to change.

export const PERSONAL = {
  name: "Gaurav Vohra",
  initials: "GV",
  title: "Backend Developer | Java | Spring Boot | Microservices",
  tagline: "Backend Developer",
  stack: "Java · Spring Boot · Microservices · Distributed Systems · AI",
  email: "gaurav999vohra@gmail.com",
  phone: "+91-8894915168",
  location: "Solan, HP, India",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/gauravvohra24", // TODO: replace with your actual GitHub profile URL
  linkedin: "https://linkedin.com/in/gauravvohra24", // TODO: replace with your actual LinkedIn profile URL
  leetcode: "https://leetcode.com/u/gauravvohra24/",
  email: `mailto:${PERSONAL.email}`,
};

export const RESUME_PATH = "/Gaurav_Vohra_Resume.pdf";

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#project" },
  { label: "Architecture", href: "#architecture" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// The page reads as one story — each chapter answers a single question.
export const CHAPTERS = [
  { id: "top", index: "00", label: "Intro", story: "I build backend systems." },
  { id: "about", index: "01", label: "About", story: "Here's how I think." },
  { id: "experience", index: "02", label: "Experience", story: "Here's where I applied it." },
  { id: "project", index: "03", label: "Projects", story: "Here's what I actually built." },
  { id: "architecture", index: "04", label: "Architecture", story: "Here's how it works." },
  { id: "skills", index: "05", label: "Skills", story: "Here's the technology behind it." },
  { id: "problem-solving", index: "06", label: "Problem Solving", story: "Here's how I keep improving." },
  { id: "contact", index: "07", label: "Contact", story: "Let's build something." },
];

export const chapter = (id) => CHAPTERS.find((c) => c.id === id);

