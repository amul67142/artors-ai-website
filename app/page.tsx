import Hero from "@/components/hero/Hero";
import Clients from "@/components/sections/Clients";
import Problem from "@/components/sections/Problem";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Clients />
      <Problem />
      <WhoWeAre />
      <Services />
    </main>
  );
}
