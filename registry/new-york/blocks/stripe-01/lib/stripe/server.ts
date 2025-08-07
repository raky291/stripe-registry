import Stripe from "stripe";
import { redirect } from "next/navigation";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function createCustomer({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      userId: userId,
    },
  });

  return customer;
}

export async function createCheckoutSession({
  userId,
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    customer: customerId,
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
  });

  if (!session.url) {
    throw new Error("Checkout session URL is not available");
  }

  redirect(session.url);
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  redirect(session.url);
}
