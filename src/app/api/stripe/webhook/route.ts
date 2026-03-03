import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, resolvePlanFromPriceId, seatsForPlan, type SeatPlan } from "@/lib/stripe";

type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIALING";

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === "trialing") return "TRIALING";
  if (status === "past_due" || status === "unpaid") return "PAST_DUE";
  if (status === "canceled") return "CANCELLED";
  return "ACTIVE";
}

async function syncSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  fallbackPlan?: string,
) {
  const priceId = subscription.items.data[0]?.price?.id ?? "";
  const resolvedPlan =
    resolvePlanFromPriceId(priceId) ?? (fallbackPlan as "SPARK" | "FAMILY" | "CHAMPION" | null);
  const plan = resolvedPlan ?? "FREE";
  const status = mapStripeStatus(subscription.status);
  const itemPeriodEnd = subscription.items.data[0]?.current_period_end ?? null;
  const currentPeriodEnd = itemPeriodEnd ? new Date(itemPeriodEnd * 1000) : null;

  await prisma.subscription.updateMany({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId: subscription.customer as string },
      ],
    },
    data: {
      plan,
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      stripeSubscriptionId: subscription.id,
      childSeats: seatsForPlan(plan as SeatPlan),
      stripeNgn: true,
    },
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "MISSING_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription as string | null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscriptionFromStripe(subscription, plan);
        }

        if (userId && session.customer) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeCustomerId: session.customer as string,
              stripeNgn: true,
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              plan: (plan as "SPARK" | "FAMILY" | "CHAMPION") ?? "FREE",
              status: "ACTIVE",
              stripeSubscriptionId: subscriptionId ?? null,
              stripeNgn: true,
              childSeats:
                plan ? seatsForPlan(plan as SeatPlan) : 1,
            },
          });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionFromStripe(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              { stripeCustomerId: subscription.customer as string },
            ],
          },
          data: {
            status: "CANCELLED",
            plan: "FREE",
            currentPeriodEnd: null,
            cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
            childSeats: 1,
          },
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          (invoice.lines?.data?.[0]?.subscription as string | undefined) ?? null;
        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json({ error: "WEBHOOK_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
