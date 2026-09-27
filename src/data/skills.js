// Grouped technical stack — sourced directly from resume.
// icon: lucide-react icon name (see components/TechStack section for mapping)

export const SKILL_GROUPS = [
  {
    key: "backend",
    title: "Backend",
    icon: "Server",
    accent: "blue",
    items: ["Java", "Spring Boot", "Spring MVC", "Spring Data JPA", "REST APIs", "Global Exception Handling"],
  },
  {
    key: "microservices",
    title: "Microservices",
    icon: "Network",
    accent: "indigo",
    items: ["Spring Cloud", "Eureka Server", "API Gateway", "Config Server"],
  },
  {
    key: "security",
    title: "Security",
    icon: "ShieldCheck",
    accent: "violet",
    items: ["Keycloak", "OAuth2", "OIDC", "JWT", "RBAC"],
  },
  {
    key: "messaging",
    title: "Messaging",
    icon: "Waypoints",
    accent: "amber",
    items: ["RabbitMQ", "Asynchronous Communication", "Event-Driven Architecture"],
  },
  {
    key: "databases",
    title: "Databases",
    icon: "Database",
    accent: "cyan",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    key: "ai",
    title: "AI",
    icon: "Sparkles",
    accent: "emerald",
    items: ["Google Gemini AI API"],
  },
  {
    key: "devops",
    title: "DevOps",
    icon: "Wrench",
    accent: "pink",
    items: ["Git", "Postman", "Docker", "IntelliJ IDEA", "Eclipse", "VS Code"],
  },
  {
    key: "frontend",
    title: "Frontend",
    icon: "LayoutPanelLeft",
    accent: "slate",
    items: ["React", "HTML5", "CSS3", "JavaScript"],
  },
];

// LeetCode numbers are live — see netlify/functions/leetcode.mjs. Nothing is hardcoded here.
export const PROBLEM_SOLVING = {
  label: "LeetCode Problems Solved",
};

// Compact "Engineering DNA" — each line traces back to the VVDN / Gemini AI Fitness Log work.
export const ENGINEERING_DNA = [
  {
    title: "Scalable systems",
    body: "Independent services behind one gateway, found through Eureka and configured centrally.",
  },
  {
    title: "Secure APIs",
    body: "Keycloak OAuth2, JWT validation and RBAC enforced before a request reaches a service.",
  },
  {
    title: "Event-driven architecture",
    body: "RabbitMQ events keep slow work off the request path and services loosely coupled.",
  },
  {
    title: "AI integration",
    body: "Gemini AI wired in asynchronously to turn activity data into personalized insight.",
  },
];
