import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { IntroSequence } from "./components/IntroSequence";
import { StoryRail } from "./components/StoryRail";
import { BackgroundField } from "./components/BackgroundField";
import { Cursor } from "./components/Cursor";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Experience } from "./sections/Experience";
import { FeaturedProject } from "./sections/FeaturedProject";
import { DeepDive } from "./sections/DeepDive";

import { Architecture } from "./sections/Architecture";
import { TechStack } from "./sections/TechStack";
import { ProblemSolving } from "./sections/ProblemSolving";
import { Contact } from "./sections/Contact";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroSequence onDone={() => setIntroDone(true)} />}

      <a
        href="#main"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-lg bg-[linear-gradient(120deg,#6366f1,#8b5cf6)] px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <BackgroundField />
      <Cursor />
      <Navbar />
      <StoryRail />

      <main id="main" tabIndex={-1} className="relative isolate overflow-x-clip outline-none">
        <Hero />
        <About />
        <Experience />
        <FeaturedProject />
        <DeepDive />
        <Architecture />
        <TechStack />
        <ProblemSolving />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
