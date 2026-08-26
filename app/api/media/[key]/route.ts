import { NextResponse } from "next/server";
import { get } from "@/lib/storage";

/** Serves uploaded media. Public by design — these are logos and photos that
 *  appear on the marketing site. */
export async function GET(_req: Request, ctx: RouteContext<"/api/media/[key]">) {
  const { key } = await ctx.params;
  const file = await get(key);
  if (!file) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.mimeType,
      // Keys are content-addressed by randomness and never reused, so a long
      // immutable cache is safe.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
