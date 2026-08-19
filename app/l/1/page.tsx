import LayoutConsole from "@/components/hero/layouts/LayoutConsole";
import Switcher from "../Switcher";

export const metadata = { title: "Layout 1 — Console" };

export default function Page() {
  return (
    <main id="main">
      <LayoutConsole />
      <Switcher current="1" />
    </main>
  );
}
