import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Featured from "@/components/sections/Featured";
import Projects from "@/components/sections/Projects";
import WorkDeck from "@/components/sections/WorkDeck";
import Philosophy from "@/components/sections/Philosophy";
import StackOrbit from "@/components/sections/StackOrbit";
import Terminal from "@/components/sections/Terminal";
import Contact from "@/components/sections/Contact";
import CommandPalette from "@/components/CommandPalette";

export default function App() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2">
        Skip to work
      </a>
      <Nav />
      <main>
        <Hero />
        <WorkDeck />
        <Featured />
        <Stats />
        <Projects />
        <Philosophy />
        <StackOrbit />
        <Terminal />
        <Contact />
      </main>
      <CommandPalette />
    </>
  );
}
