import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { lazyNamed } from "../lib/lazy";
import { Deferred } from "../components/Deferred";
import { AmbientGlow } from "../components/AmbientGlow";
import { CATEGORY_COLORS } from "../data/categoryColors";

const ArchitectureDiagram = lazyNamed(() => import("../components/ArchitectureDiagram"), "ArchitectureDiagram");

const LEGEND = [
  { label: "Security", key: "security" },
  { label: "Gateway", key: "edge" },
  { label: "Services", key: "service" },
  { label: "Messaging", key: "messaging" },
  { label: "Database", key: "data" },
  { label: "AI", key: "ai" },
  { label: "Platform", key: "platform" },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative py-16 sm:py-24">
      <AmbientGlow variant="architecture" />
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            chapter="architecture"
            title="Under the hood."
            description="Every component of the Gemini AI Fitness Log and how they connect. Inspect any node, or switch to trace view to follow one request end to end."
          />
          <ul className="flex flex-wrap gap-1.5 lg:max-w-sm lg:justify-end">
            {LEGEND.map((item) => {
              const c = CATEGORY_COLORS[item.key];
              return (
                <li key={item.key} className={`flex items-center gap-1.5 rounded-full border ${c.border} ${c.bg} px-2.5 py-1 text-[11px] font-medium ${c.text}`}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card-glow rounded-[28px] border border-[var(--color-border)] bg-white p-4 sm:p-6 lg:p-8">
          <Deferred className="min-h-[600px] sm:min-h-[530px] md:min-h-[610px] lg:min-h-[760px] xl:min-h-[840px]">
            <ArchitectureDiagram />
          </Deferred>
        </div>
      </Container>
    </section>
  );
}
