import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, getPriceId, type StripeBilling, type StripePlan } from "@/lib/stripe";

const PLANS: StripePlan[] = ["SPARK", "FAMILY", "CHAMPION"];
const BILLING: StripeBilling[] = ["monthly", "annual"];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const plan = payload?.plan as StripePlan | undefined;
  const billing = payload?.billing as StripeBilling | undefined;

  if (!plan || !billing || !PLANS.includes(plan) || !BILLING.includes(billing)) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  let priceId = "";
  let stripe = null as ReturnType<typeof getStripe> | null;
  try {
    priceId = getPriceId(plan, billing);
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "STRIPE_NOT_CONFIGURED" }, { status: 500 });
  }

  const existing = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const customerId =
    existing?.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      })
    ).id;

  const checkout = await stripe!.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: {
      userId: session.user.id,
      plan,
      billing,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    update: {
      stripeCustomerId: customerId,
      stripeNgn: true,
    },
    create: {
      userId: session.user.id,
      stripeCustomerId: customerId,
      plan: "FREE",
      status: "ACTIVE",
      childSeats: 1,
      stripeNgn: true,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
