import HeroB from "@/components/hero/variants/HeroB";
import Switcher from "../Switcher";

export const metadata = { title: "Hero B — Artors preview" };

export default function Page() {
  return (
    <main id="main">
      <HeroB />
      <Switcher current="b" />
    </main>
  );
}
