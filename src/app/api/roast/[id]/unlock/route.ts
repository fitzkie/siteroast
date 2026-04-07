import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOneTimeCheckout } from "@/lib/stripe";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/roast/[id]/unlock">) {
  const { id } = await ctx.params;

  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: (session.user as { id: string }).id } });
  if (user?.subscriptionStatus === "active") {
    await prisma.report.update({ where: { id }, data: { isPreview: false, userId: user.id } });
    return NextResponse.json({ unlocked: true, slug: report.shareSlug });
  }

  const checkoutUrl = await createOneTimeCheckout(id, (session.user as { id: string }).id, process.env.NEXT_PUBLIC_APP_URL!);
  return NextResponse.json({ checkoutUrl });
}
