import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as Stripe.LatestApiVersion,
});

export async function createOneTimeCheckout(reportId: string, userId: string, returnUrl: string): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ONE_TIME!, quantity: 1 }],
    metadata: { reportId, userId, type: "one_time" },
    success_url: `${returnUrl}/report/{CHECKOUT_SESSION_ID}?success=true`,
    cancel_url: `${returnUrl}?cancelled=true`,
  });
  return session.url!;
}

export async function createSubscriptionCheckout(userId: string, customerEmail: string, returnUrl: string): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_SUBSCRIPTION!, quantity: 1 }],
    metadata: { userId, type: "subscription" },
    customer_email: customerEmail,
    success_url: `${returnUrl}/dashboard?subscribed=true`,
    cancel_url: `${returnUrl}/pricing?cancelled=true`,
  });
  return session.url!;
}

export async function createCustomerPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${returnUrl}/dashboard`,
  });
  return session.url;
}
