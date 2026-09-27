// Current role at VVDN — every line here comes from the actual work on the
// School Management System (Nepal). No traffic, user, school, team-size or
// performance figures: those aren't claims this portfolio makes.

export const CURRENT_ROLE = {
  company: "VVDN Technologies",
  role: "Software Engineer Trainee",
  location: "Noida, India",
  start: "Apr 2026",
  period: "Apr 2026 — Present",
  project: "School Management System — Nepal",
  description:
    "Working on a real-world School Management System for Nepal, primarily focused on backend engineering, microservices, identity and access management, service integration, database design and deployment.",
  ownership:
    "Owned major backend components — primarily responsible for backend development across the identity, school and teacher services, and worked closely with the engineering team to deliver APIs and integrate services.",
  focus: ["Backend", "Microservices", "IAM", "Deployment"],
};

export const PLATFORM_ROLES = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "TEACHER",
  "STUDENT",
  "PARENT",
  "ACCOUNTANT",
  "LIBRARIAN",
  "HOSTEL_WARDEN",
  "TRANSPORT_STAFF",
];
export const MAJOR_ROLE_COUNT = 4;

export const IAM_CAPABILITIES = [
  "User login",
  "User creation",
  "Authentication flows",
  "JWT-based authentication",
  "Role-based access control",
  "Keycloak integration",
  "Secure service access",
];

export const PRIMARY_SERVICES = [
  { key: "identity", label: "Identity Service", hint: "Authentication + authorization", responsibility: "Login, user creation and authentication flows on top of Keycloak, with JWT-based, role-based access control for every other service." },
  { key: "school", label: "School Service", hint: "School administration + core school data", responsibility: "School administration APIs and the core school data other modules build on." },
  { key: "teacher", label: "Teacher Service", hint: "Teacher workflows + APIs", responsibility: "Teacher-facing workflows and the APIs that expose them to the rest of the platform." },
  { key: "platform", label: "Other platform services", hint: "Consume these APIs", responsibility: "The wider School Management System — modules built with the team that integrate with these services." },
];

export const SERVICE_TECH = [
  "REST APIs",
  "Spring Boot",
  "PostgreSQL",
  "Spring Security",
  "Keycloak",
  "Service-to-service communication",
  "Validation",
  "Exception handling",
  "Database design",
];

export const DELIVERY_STAGES = ["Backend Development", "API Delivery", "Service Integration", "Database Design", "ER Diagrams", "Testing", "Deployment"];

// Career arc shown under the timeline.
export const CAREER_ARC = [
  { label: "Spring Boot foundation", phase: "training" },
  { label: "Microservices", phase: "training" },
  { label: "Real product development", phase: "current" },
  { label: "Identity + Keycloak", phase: "current" },
  { label: "Backend service ownership", phase: "current" },
  { label: "Database + API design", phase: "current" },
  { label: "Service integration", phase: "current" },
  { label: "Real deployment", phase: "current" },
];

// "Explore my work" tabs.
export const WORK_TABS = [
  {
    key: "identity",
    label: "Identity",
    caption: "Users sign in through Keycloak; the Identity Service handles login and user creation, and every request carries a JWT checked against role-based access rules.",
    chain: ["Login", "Keycloak", "JWT", "RBAC", "Service access"],
    extra: ["User creation → Keycloak"],
  },
  {
    key: "services",
    label: "Services",
    caption: "Identity, School and Teacher services — the backend components I was primarily responsible for — integrated into the wider platform.",
    chain: ["Identity Service", "School Service", "Teacher Service", "Service Integration"],
  },
  {
    key: "data",
    label: "Data",
    caption: "Functional requirements become ER diagrams, then PostgreSQL schemas and the data models behind each API.",
    chain: ["ER Diagrams", "Database Schema", "PostgreSQL", "API Data Models"],
  },
  {
    key: "deployment",
    label: "Deployment",
    caption: "Services are built, shipped to real VM environments over SSH, run in Docker and verified — not just run locally.",
    chain: ["Build", "SSH", "VM", "Docker", "Service Verification"],
  },
];
