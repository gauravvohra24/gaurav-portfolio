import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { TechCard } from "../components/TechCard";
import { TechOrbit } from "../components/TechOrbit";
import { AmbientGlow } from "../components/AmbientGlow";
import { SKILL_GROUPS } from "../data/skills";

export function TechStack() {
  return (
    <section id="skills" className="relative py-16 sm:py-24">
      <AmbientGlow variant="skills" />
      <Container className="flex flex-col gap-10">
        <SectionHeading
          chapter="skills"
          eyebrow="Technical Expertise"
          title="The stack behind the system."
          description="Grouped by where each tool sits in the architecture — no proficiency bars."
        />

        <TechOrbit />

        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group, i) => (
            <TechCard key={group.key} group={group} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
