import LayoutIndex from "@/components/hero/layouts/LayoutIndex";
import Switcher from "../Switcher";

export const metadata = { title: "Layout 2 — Index" };

export default function Page() {
  return (
    <main id="main">
      <LayoutIndex />
      <Switcher current="2" />
    </main>
  );
}
