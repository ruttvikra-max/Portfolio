import ScrollProgress from "@/components/site/ScrollProgress";
import TopBar from "@/components/site/TopBar";
import Hero from "@/components/site/Hero";
import ContextStrip from "@/components/site/ContextStrip";
import Problem from "@/components/site/Problem";
import Research from "@/components/site/Research";
import Personas from "@/components/site/Personas";
import Market from "@/components/site/Market";
import TurningPoint from "@/components/site/TurningPoint";
import Solution from "@/components/site/Solution";
import UnderTheHood from "@/components/site/UnderTheHood";
import Outcome from "@/components/site/Outcome";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <TopBar />
      <main className="flex-1 bg-void">
        <Hero />
        <ContextStrip />
        <Problem />
        <Research />
        <Personas />
        <Market />
        <TurningPoint />
        <Solution />
        <UnderTheHood />
        <Outcome />
      </main>
    </>
  );
}
