import { and, asc, eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

/**
 * Public reads — docs/ADMIN.md §6.
 *
 * Everything here filters on `published`, and every function returns an empty
 * array when the database is unreachable or has nothing to show. That is the
 * mechanism behind docs/PLAN.md §2: a section with no rows renders nothing at
 * all rather than falling back to placeholder proof. An empty page is honest;
 * an invented testimonial is not.
 *
 * These run inside statically rendered pages. The admin calls revalidatePath()
 * on every publish, so the cache drops the moment content changes.
 */

export type ClientMark = {
  id: number;
  name: string;
  kind: "client" | "integration";
  logoUrl: string | null;
  websiteUrl: string | null;
};

export async function getClientMarks(): Promise<ClientMark[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return (await db
      .select({
        id: schema.clients.id,
        name: schema.clients.name,
        kind: schema.clients.kind,
        logoUrl: schema.clients.logoUrl,
        websiteUrl: schema.clients.websiteUrl,
      })
      .from(schema.clients)
      .where(eq(schema.clients.published, true))
      .orderBy(asc(schema.clients.sortOrder), asc(schema.clients.id))) as ClientMark[];
  } catch (e) {
    console.error("[content:clients]", e);
    return [];
  }
}

export type Testimonial = typeof schema.testimonials.$inferSelect;

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.published, true))
      .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id));
  } catch (e) {
    console.error("[content:testimonials]", e);
    return [];
  }
}

export type TeamMember = typeof schema.teamMembers.$inferSelect;

export async function getTeam(): Promise<TeamMember[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.published, true))
      .orderBy(
        desc(schema.teamMembers.isFounder),
        asc(schema.teamMembers.sortOrder),
        asc(schema.teamMembers.id),
      );
  } catch (e) {
    console.error("[content:team]", e);
    return [];
  }
}

export type CaseStudy = typeof schema.caseStudies.$inferSelect;

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.caseStudies)
      .where(eq(schema.caseStudies.published, true))
      .orderBy(asc(schema.caseStudies.sortOrder), desc(schema.caseStudies.id));
  } catch (e) {
    console.error("[content:case-studies]", e);
    return [];
  }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select()
      .from(schema.caseStudies)
      .where(and(eq(schema.caseStudies.slug, slug), eq(schema.caseStudies.published, true)))
      .limit(1);
    return row ?? null;
  } catch (e) {
    console.error("[content:case-study]", e);
    return null;
  }
}
