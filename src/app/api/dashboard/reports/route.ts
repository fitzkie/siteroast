import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const reports = await prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, overallScore: true, overallGrade: true, shareSlug: true, isPreview: true, createdAt: true },
  });

  return NextResponse.json({ reports });
}
