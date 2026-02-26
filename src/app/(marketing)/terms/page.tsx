import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-heading text-3xl">Terms of Service</h1>
      <p className="mt-4 text-cq-text-secondary">
        Terms of Service — Full terms coming soon. CodeQuest operates under UK law and is designed
        for children aged 6–14.
      </p>
    </section>
  );
}
