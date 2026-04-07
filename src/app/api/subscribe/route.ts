import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSubscriptionCheckout } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const checkoutUrl = await createSubscriptionCheckout(
    (session.user as { id: string }).id,
    session.user.email,
    process.env.NEXT_PUBLIC_APP_URL!
  );
  return NextResponse.json({ checkoutUrl });
}
