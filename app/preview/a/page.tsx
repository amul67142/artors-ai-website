import HeroA from "@/components/hero/variants/HeroA";
import Switcher from "../Switcher";

export const metadata = { title: "Hero A — Artors preview" };

export default function Page() {
  return (
    <main id="main">
      <HeroA />
      <Switcher current="a" />
    </main>
  );
}
