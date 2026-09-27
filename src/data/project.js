export const FEATURED_PROJECT = {
  name: "Gemini AI Fitness Log",
  subtitle: "Distributed Microservices Platform",
  tagline:
    "A fitness-tracking backend split into independent services, wired together with async messaging and generative AI.",
  tech: ["Spring Boot", "Spring Cloud", "PostgreSQL", "Keycloak", "RabbitMQ", "Gemini AI", "Docker"],
  // Headline facts for the case-study masthead — all derived from the capabilities below.
  stats: [
    { value: "3", label: "Microservices" },
    { value: "1", label: "API Gateway" },
    { value: "OAuth2", label: "JWT + RBAC" },
    { value: "Async", label: "RabbitMQ events" },
  ],
  capabilities: [
    "3 independent microservices — User, Activity, AI",
    "Gemini AI-generated personalized fitness insights",
    "OAuth2 / JWT security with RBAC at the gateway",
    "RabbitMQ event pipeline between Activity and AI services",
    "User synchronization filter for seamless onboarding",
    "Eureka service discovery + centralized configuration",
  ],

  caseStudy: {
    problem: {
      heading: "The Problem",
      body: [
        "Fitness activity is easy to log and hard to turn into something useful. Turning raw entries into personalized guidance means calling a generative model — a call that is slow and shouldn't block the request that created the activity.",
        "The goal was a backend where activity tracking, user management, and AI insight generation are independent services: each can change, deploy, and fail without taking the others down.",
      ],
    },
    architecture: {
      heading: "The Architecture",
      body: "Every client request enters through a single API Gateway, which authenticates it and routes it to the right service. The three services never call each other directly for the AI workflow — they're connected through RabbitMQ instead.",
      flow: ["Client", "API Gateway", "User / Activity / AI Service", "RabbitMQ", "AI Processing", "Gemini AI"],
    },
    services: {
      heading: "The Services",
      items: [
        {
          name: "User Service",
          description: "Owns user identity and profile data, kept in sync with Keycloak through a gateway-level filter.",
        },
        {
          name: "Activity Service",
          description: "Records fitness activity and publishes a domain event to RabbitMQ after every write.",
        },
        {
          name: "AI Service",
          description: "Consumes activity events, calls the Gemini AI API, and returns a personalized insight.",
        },
      ],
    },
    security: {
      heading: "Security",
      body: "Keycloak issues OAuth2 / OIDC tokens; the gateway validates every JWT before a request reaches a service and enforces role-based access control centrally, so individual services stay free of duplicated auth logic.",
      points: ["Keycloak OAuth2 / OIDC", "JWT validation at the gateway", "RBAC enforced centrally", "User sync filter on login"],
    },
    eventFlow: {
      heading: "Event Flow",
      body: "Activity creation and AI processing are decoupled through a message queue, so a slow model call never blocks the write path.",
      steps: ["Activity created", "Activity Service", "RabbitMQ", "AI Service", "Gemini AI", "Personalized insight"],
    },
    aiIntegration: {
      heading: "AI Integration",
      body: "The AI Service consumes activity events asynchronously and calls the Google Gemini AI API to auto-generate a personalized fitness insight, keeping the generative call fully decoupled from the request/response cycle.",
    },
    technology: {
      heading: "Technology",
      groups: [
        { label: "Core", items: ["Spring Boot", "Spring Cloud"] },
        { label: "Discovery & Config", items: ["Eureka Service Discovery", "Spring Cloud Config Server"] },
        { label: "Data", items: ["PostgreSQL"] },
        { label: "Security", items: ["Keycloak", "OAuth2 / JWT"] },
        { label: "Messaging", items: ["RabbitMQ"] },
        { label: "AI", items: ["Gemini AI"] },
        { label: "Infra", items: ["Docker"] },
      ],
    },
  },
};

export const DEEP_DIVE_STORIES = [
  {
    key: "microservices",
    title: "Why Microservices?",
    body: "User, Activity and AI concerns change for different reasons — separate services keep each one small, focused and independently deployable.",
  },
  {
    key: "rabbitmq",
    title: "Why RabbitMQ?",
    body: "Asynchronous communication keeps AI processing decoupled from the activity request.",
  },
  {
    key: "security",
    title: "How Security Works",
    body: "Keycloak issues the token; the gateway validates the JWT and enforces RBAC before any service sees the request.",
  },
];
