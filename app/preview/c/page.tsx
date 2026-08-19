import HeroC from "@/components/hero/variants/HeroC";
import Switcher from "../Switcher";

export const metadata = { title: "Hero C — Artors preview" };

export default function Page() {
  return (
    <main id="main">
      <HeroC />
      <Switcher current="c" />
    </main>
  );
}
