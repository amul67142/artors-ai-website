import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, faqSchema } from "@/lib/schema";
import { trail } from "@/lib/seo/breadcrumbs";
import { getTeam } from "@/lib/content/db";
import { faq } from "@/lib/content/sections";
import Hero from "@/components/hero/Hero";
import Clients from "@/components/sections/Clients";
import Problem from "@/components/sections/Problem";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Services from "@/components/sections/Services";
import { Proof, Process, Industries, Engagements, Faq, CtaBand } from "@/components/sections/Lower";
import Testimonials from "@/components/sections/Testimonials";

export default async function Home() {
  // Founders come from the same collection /about renders, so the Person
  // entity in the graph cannot drift from the page.
  const founders = (await getTeam()).filter((p) => p.isFounder);

  return (
    <main id="main">
      <JsonLd
        schema={[
          organizationSchema(founders),
          websiteSchema(),
          faqSchema(faq.items),
          trail(),
        ]}
      />
      <Hero />
      <Clients />
      <Problem />
      <WhoWeAre />
      <Services />
      <Proof />
      <Process />
      <Industries />
      <Engagements />
      <Testimonials />
      <Faq />
      <CtaBand />
    </main>
  );
}
