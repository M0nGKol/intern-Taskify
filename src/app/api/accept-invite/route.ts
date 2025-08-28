import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { project } from "@/db/schema";
import { eq } from "drizzle-orm";
import { acceptProjectInvite } from "@/actions/project-action";

function redirectNoStore(url: URL) {
  const res = NextResponse.redirect(url);
  res.headers.set("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate");
  return res;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return redirectNoStore(new URL("/sign-in?error=invalid-token", req.url));

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return redirectNoStore(new URL(`/sign-in?invite-token=${encodeURIComponent(token)}`, req.url));
    }

    const member = await acceptProjectInvite({ token, userId: session.user.id });
    if (!member) return redirectNoStore(new URL("/dashboard?error=invalid-or-expired-invite", req.url));

    const rows = await db.select({ teamId: project.teamId }).from(project).where(eq(project.id, member.projectId));
    const teamId = rows?.[0]?.teamId;
    return redirectNoStore(new URL(teamId ? `/projects/${teamId}` : "/dashboard", req.url));
  } catch (e) {
    console.error("Accept invite error:", e);
    return redirectNoStore(new URL("/dashboard?error=invite-failed", req.url));
  }
}