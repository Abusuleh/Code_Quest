import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-heading text-3xl">Privacy Policy</h1>
      <p className="mt-4 text-cq-text-secondary">
        Privacy Policy — Full policy coming soon. CodeQuest is committed to the highest standards of
        child data protection. Contact: privacy@codequest.world
      </p>
    </section>
  );
}
