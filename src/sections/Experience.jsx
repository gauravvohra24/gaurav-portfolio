import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { TimelineItem } from "../components/TimelineItem";
import { AmbientGlow } from "../components/AmbientGlow";
import { CareerTimeline } from "../components/experience/CareerTimeline";
import { CurrentRole } from "../components/experience/CurrentRole";
import { EXPERIENCE } from "../data/experience";

export function Experience() {
  return (
    <section id="experience" className="relative py-16 sm:py-24">
      <AmbientGlow variant="experience" />
      <Container className="flex flex-col gap-10">
        <SectionHeading
          chapter="experience"
          title="From training to real product engineering."
          description="Spring Boot foundations first — now backend ownership on a real School Management System."
        />

        <CareerTimeline />

        <CurrentRole />

        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            Where it started
            <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden="true" />
          </p>
          {EXPERIENCE.map((entry) => (
            <TimelineItem key={entry.company + entry.role} entry={entry} />
          ))}
        </div>
      </Container>
    </section>
  );
}
