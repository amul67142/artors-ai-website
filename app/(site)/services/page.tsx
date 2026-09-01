import type { Metadata } from "next";
import Services from "@/components/sections/Services";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Services | Artors",
  description:
    "Seven AI practices, usually combined: application development, process automation, agents, conversational AI, marketing, content and consulting.",
};

export default function ServicesIndex() {
  return (
    <main id="main" style={{ paddingTop: 120 }}>
      <Services />
    </main>
  );
}
