import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { reportId, userId, type } = session.metadata!;
      if (type === "one_time" && reportId && userId) {
        const payment = await prisma.payment.create({
          data: { userId, stripePaymentId: session.payment_intent as string, type: "one_time", amountCents: session.amount_total!, status: "succeeded" },
        });
        await prisma.report.update({ where: { id: reportId }, data: { isPreview: false, userId, paymentId: payment.id } });
      }
      if (type === "subscription" && userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: "active", subscriptionStripeId: session.subscription as string, stripeCustomerId: session.customer as string },
        });
        await prisma.payment.create({
          data: { userId, stripePaymentId: session.subscription as string, type: "subscription", amountCents: session.amount_total!, status: "succeeded" },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({ where: { subscriptionStripeId: subscription.id }, data: { subscriptionStatus: "cancelled" } });
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await prisma.user.updateMany({ where: { subscriptionStripeId: invoice.subscription as string }, data: { subscriptionStatus: "past_due" } });
      }
      break;
    }
  }
  return NextResponse.json({ received: true });
}
