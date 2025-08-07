import { NextRequest, NextResponse } from "next/server";
import { StripeSync } from "@supabase/stripe-sync-engine";

const databaseUrl = process.env.SUPABASE_DATABASE_URL!;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

const stripeSync = new StripeSync({
  databaseUrl,
  schema: "stripe",
  stripeSecretKey,
  stripeWebhookSecret,
  stripeApiVersion: "2025-05-28.basil",
  autoExpandLists: true,
  backfillRelatedEntities: true,
  maxPostgresConnections: 5,
});

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    await stripeSync.processWebhook(payload, signature);

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    console.error(message);
    return new NextResponse(message, { status: 500 });
  }
}
