import Stripe from "stripe";

export type StripePlan = "SPARK" | "FAMILY" | "CHAMPION";
export type StripeBilling = "monthly" | "annual";

type StripeEnv = {
  secretKey: string;
  priceSparkMonthly: string;
  priceSparkAnnual: string;
  priceFamilyMonthly: string;
  priceFamilyAnnual: string;
  priceChampionMonthly: string;
  priceChampionAnnual: string;
};

function getStripeEnv(): StripeEnv {
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const priceSparkMonthly = process.env.STRIPE_PRICE_SPARK_MONTHLY ?? "";
  const priceSparkAnnual = process.env.STRIPE_PRICE_SPARK_ANNUAL ?? "";
  const priceFamilyMonthly = process.env.STRIPE_PRICE_FAMILY_MONTHLY ?? "";
  const priceFamilyAnnual = process.env.STRIPE_PRICE_FAMILY_ANNUAL ?? "";
  const priceChampionMonthly = process.env.STRIPE_PRICE_CHAMPION_MONTHLY ?? "";
  const priceChampionAnnual = process.env.STRIPE_PRICE_CHAMPION_ANNUAL ?? "";

  if (
    !secretKey ||
    !priceSparkMonthly ||
    !priceSparkAnnual ||
    !priceFamilyMonthly ||
    !priceFamilyAnnual ||
    !priceChampionMonthly ||
    !priceChampionAnnual
  ) {
    throw new Error("Stripe environment variables are missing.");
  }

  return {
    secretKey,
    priceSparkMonthly,
    priceSparkAnnual,
    priceFamilyMonthly,
    priceFamilyAnnual,
    priceChampionMonthly,
    priceChampionAnnual,
  };
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const env = getStripeEnv();
    stripeClient = new Stripe(env.secretKey, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return stripeClient;
}

export function getPriceId(plan: StripePlan, billing: StripeBilling): string {
  const env = getStripeEnv();
  if (plan === "SPARK" && billing === "monthly") return env.priceSparkMonthly;
  if (plan === "SPARK" && billing === "annual") return env.priceSparkAnnual;
  if (plan === "FAMILY" && billing === "monthly") return env.priceFamilyMonthly;
  if (plan === "FAMILY" && billing === "annual") return env.priceFamilyAnnual;
  if (plan === "CHAMPION" && billing === "monthly") return env.priceChampionMonthly;
  return env.priceChampionAnnual;
}

export function resolvePlanFromPriceId(priceId: string): StripePlan | null {
  const env = getStripeEnv();
  if (priceId === env.priceSparkMonthly || priceId === env.priceSparkAnnual) return "SPARK";
  if (priceId === env.priceFamilyMonthly || priceId === env.priceFamilyAnnual) return "FAMILY";
  if (priceId === env.priceChampionMonthly || priceId === env.priceChampionAnnual)
    return "CHAMPION";
  return null;
}

export function seatsForPlan(plan: StripePlan): number {
  if (plan === "FAMILY" || plan === "CHAMPION") return 3;
  return 1;
}
