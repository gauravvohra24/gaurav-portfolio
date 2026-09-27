export const EXPERIENCE = [
  {
    role: "Spring Boot Intern",
    company: "VVDN Technologies",
    location: "Noida",
    period: "Dec 2025 — Feb 2026",
    summary:
      "Completed a structured Spring Boot curriculum and built a distributed microservices system end-to-end — from service discovery to security to messaging.",
    points: [
      "Designed and developed a distributed Gemini AI Fitness microservices system",
      "Implemented Eureka Service Discovery and Spring Cloud Config Server for centralized configuration",
      "Built an API Gateway with a JWT validation filter, routing, and centralized request handling",
      "Integrated Keycloak OAuth2 for authentication, JWT-based authorization, and RBAC",
      "Implemented asynchronous inter-service messaging with RabbitMQ for loose coupling",
      "Designed REST APIs with input validation, layered architecture, and global exception handling",
      "Applied event-driven architecture principles for scalability and service independence",
    ],
    // Scannable summary of the bullets above — same facts, grouped by area.
    highlights: [
      { key: "microservices", label: "Microservices", value: "Eureka + Spring Cloud", category: "service" },
      { key: "security", label: "Security", value: "Keycloak + OAuth2 + JWT + RBAC", category: "security" },
      { key: "messaging", label: "Messaging", value: "RabbitMQ + Event-Driven Architecture", category: "messaging" },
      { key: "api", label: "API", value: "REST + Validation + Exception Handling", category: "data" },
    ],
    // Concepts named in the points above.
    concepts: [
      "Microservices",
      "Service discovery",
      "Centralized configuration",
      "API Gateway pattern",
      "OAuth2 / OIDC",
      "RBAC",
      "Event-driven architecture",
      "Layered architecture",
    ],
    tech: ["Spring Boot", "Spring Cloud", "Eureka", "RabbitMQ", "Keycloak", "JWT", "PostgreSQL"],
  },
];
