import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Bot, KeyRound, MessageSquareText, Route, User, Boxes, Globe, ShieldCheck } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { EASE, REVEAL } from "../lib/motion";
import { DEEP_DIVE_STORIES } from "../data/project";

const ACCENTS = {
  microservices: { color: "#3b82f6", icon: Boxes, bg: "bg-blue-50", text: "text-[var(--color-blue-ink)]", border: "border-blue-200" },
  rabbitmq: { color: "#f59e0b", icon: MessageSquareText, bg: "bg-amber-50", text: "text-[var(--color-amber-ink)]", border: "border-amber-200" },
  security: { color: "#8b5cf6", icon: ShieldCheck, bg: "bg-violet-50", text: "text-[var(--color-violet-ink)]", border: "border-violet-200" },
};

function Chip({ icon: Icon, label, tone = "bg-slate-50 text-slate-500", note }) {
  const [bg, text] = tone.split(" ");
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${bg}`}>
        <Icon className={`h-3 w-3 ${text}`} aria-hidden="true" />
      </span>
      <span className="truncate font-mono text-[11px] font-semibold text-[var(--color-text)]">{label}</span>
      {note && <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-faint)]">{note}</span>}
    </div>
  );
}

// A short vertical wire with a packet running down it (pure CSS animation).
function Wire({ color, delay = 0 }) {
  return (
    <div className="relative mx-auto h-5 w-px bg-[var(--color-border)]" aria-hidden="true">
      <span className="dd-packet absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color, animationDelay: `${delay}s` }} />
    </div>
  );
}

function MicroservicesVisual() {
  const services = [
    { icon: User, label: "User" },
    { icon: Activity, label: "Activity" },
    { icon: Bot, label: "AI" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Chip icon={Route} label="API Gateway" tone="bg-indigo-50 text-[var(--color-indigo-ink)]" />
      <div className="relative h-4" aria-hidden="true">
        <span className="absolute left-[16.66%] right-[16.66%] top-0 h-2 rounded-t border-x border-t border-[var(--color-border)]" />
        <span className="absolute left-1/2 top-0 h-4 w-px bg-[var(--color-border)]" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {services.map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex flex-col items-center gap-1 rounded-lg border border-blue-100 bg-white py-2">
            <Icon className="h-3.5 w-3.5 text-[var(--color-blue-ink)]" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-[var(--color-text)]">{label}</span>
            {/* independent deploy heartbeat, deliberately out of phase */}
            <span className="dd-beat h-1 w-6 rounded-full bg-blue-400" style={{ animationDelay: `${i * 0.7}s` }} />
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-faint)]">deploy independently</p>
    </div>
  );
}

function RabbitVisual() {
  return (
    <div className="flex flex-col">
      <Chip icon={Activity} label="Activity Service" tone="bg-blue-50 text-[var(--color-blue-ink)]" note="responds" />
      <Wire color="#f59e0b" />
      <Chip icon={MessageSquareText} label="RabbitMQ" tone="bg-amber-50 text-[var(--color-amber-ink)]" note="queue" />
      <Wire color="#f59e0b" delay={0.9} />
      <Chip icon={Bot} label="AI Service" tone="bg-emerald-50 text-[var(--color-emerald-ink)]" note="async" />
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="flex flex-col">
      <Chip icon={Globe} label="Client login" />
      <Wire color="#8b5cf6" />
      <Chip icon={KeyRound} label="Keycloak" tone="bg-violet-50 text-[var(--color-violet-ink)]" note="issues JWT" />
      <Wire color="#8b5cf6" delay={0.9} />
      <Chip icon={Route} label="API Gateway" tone="bg-indigo-50 text-[var(--color-indigo-ink)]" note="JWT + RBAC" />
    </div>
  );
}

const VISUALS = { microservices: MicroservicesVisual, rabbitmq: RabbitVisual, security: SecurityVisual };

export function DeepDive() {
  const [active, setActive] = useState(DEEP_DIVE_STORIES[1].key);

  return (
    <section id="how-it-works" className="relative py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="How the system works"
          title="Three decisions, and why."
          description="The reasoning behind the Gemini AI Fitness Log — each one shown in motion."
        />

        <div className="flex flex-col gap-4 md:flex-row">
          {DEEP_DIVE_STORIES.map((story, i) => {
            const accent = ACCENTS[story.key];
            const Visual = VISUALS[story.key];
            const isActive = active === story.key;
            const Icon = accent.icon;
            return (
              <motion.div
                key={story.key}
                tabIndex={0}
                onMouseEnter={() => setActive(story.key)}
                onFocus={() => setActive(story.key)}
                onClick={() => setActive(story.key)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                style={{ flexGrow: isActive ? 1.5 : 1 }}
                className={`dd-card group relative flex min-w-0 basis-0 flex-col gap-4 overflow-hidden cursor-default rounded-2xl border bg-white p-6 text-left transition-[flex-grow,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? `${accent.border} card-glow` : "border-[var(--color-border)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                } ${isActive ? "" : "dd-paused"}`}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px] transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, ${accent.color}, ${accent.color}22)`, opacity: isActive ? 1 : 0 }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg}`}>
                    <Icon className={`h-5 w-5 ${accent.text}`} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-2xl font-extrabold" style={{ color: isActive ? accent.color : "#e2e8f0" }}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{story.title}</h3>

                {/* Visual — revealed for the active card on desktop, always shown when stacked on mobile */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:grid-rows-[1fr] max-md:opacity-100 ${
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-3">
                      <Visual />
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{story.body}</p>
                {!isActive && (
                  <span className="mt-auto hidden items-center gap-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] md:inline-flex" style={{ color: accent.color }}>
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent.color }} />
                    Hover to see it in motion
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
