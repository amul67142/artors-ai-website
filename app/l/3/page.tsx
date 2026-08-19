import LayoutBands from "@/components/hero/layouts/LayoutBands";
import Switcher from "../Switcher";

export const metadata = { title: "Layout 3 — Bands" };

export default function Page() {
  return (
    <main id="main">
      <LayoutBands />
      <Switcher current="3" />
    </main>
  );
}
