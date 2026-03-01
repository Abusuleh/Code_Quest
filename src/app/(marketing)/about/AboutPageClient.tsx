"use client";

import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { WaitlistCTA } from "@/components/organisms/WaitlistCTA";

const scottCredentials = [
  "DEdPsych CPsychol",
  "HCPC PYL042340",
  "15+ years across UK Local Authorities",
  "SEND, school exclusion, restorative practice",
  "University of Southampton — Educational Exclusion",
  "Also builds EdPsych Connect World",
];

const avmCredentials = [
  "Certified Aircraft Engineer",
  "Air Vice Marshall",
  "Among the finest aviation engineers of his generation",
  "Platform architecture, engineering standards, systems thinking",
];

export function AboutPageClient() {
  const scrollToWaitlist = () => {
    const target = document.querySelector("#waitlist");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="pt-28">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-display text-xs uppercase tracking-[0.45em] text-cq-text-secondary">
            Our Story
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">
            Two Childhood Friends. One Shared Vision.
          </h1>
          <p className="mt-6 max-w-3xl font-heading text-lg text-cq-text-secondary">
            <span className="bg-gradient-to-r from-cq-primary via-cq-violet to-cq-cyan bg-clip-text text-transparent">
              A conversation between two lifelong friends became a mission to build the most
              immersive coding world for children — where curiosity becomes confidence.
            </span>
          </p>

          <div className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl border border-cq-primary/40 shadow-glow-primary">
            <Image
              src="/founders-together.jpg"
              alt="Dr Scott Ighavongbe-Patrick and Air Vice Marshall Abubakar Suleh together"
              width={1600}
              height={1000}
              priority
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 720px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-cq-bg-overlay/80 px-6 py-4 backdrop-blur">
              <p className="text-sm text-cq-text-primary sm:text-base">
                Dr Scott Ighavongbe-Patrick &amp; Air Vice Marshall Abubakar Suleh
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-cq-border bg-cq-bg-panel p-8 shadow-panel">
          <div className="border-l-4 border-cq-gold pl-6">
            <h2 className="font-display text-2xl sm:text-3xl">The Origin Story</h2>
            <p className="mt-4 text-cq-text-secondary">
              CodeQuest began with two secondary school friends who never lost touch — a chartered
              psychologist devoted to children&apos;s learning and an aircraft engineer obsessed
              with systems that cannot fail. When their own children started asking how to build the
              games and apps they loved, they realized the tools did not exist for the way kids
              actually learn.
            </p>
            <p className="mt-4 text-cq-text-secondary">
              So they built the world they wished they had: a place where narrative, mentorship, and
              real engineering standards meet. CodeQuest is their shared promise that every child
              can step into a future they design for themselves.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-4">
          <p className="font-display text-xs uppercase tracking-[0.45em] text-cq-text-secondary">
            Meet the Founders
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">The Minds Behind CodeQuest</h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-cq-primary/40 bg-cq-bg-elevated p-8 shadow-glow-primary">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cq-primary/60 bg-cq-primary/20 text-lg font-display text-cq-primary shadow-glow-primary">
                SP
              </div>
              <div>
                <h3 className="font-heading text-xl">Dr Scott Ighavongbe-Patrick</h3>
                <p className="text-sm text-cq-text-secondary">
                  Co-Founder · Chartered Educational Psychologist
                </p>
                <p className="mt-1 text-sm text-cq-primary">The pedagogy behind the platform.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-cq-text-secondary">
              <p>
                Dr Scott has spent over 15 years supporting children across UK Local Authorities,
                specializing in SEND, school exclusion, and restorative practice. His work is
                grounded in the belief that potential should never be limited by circumstance.
              </p>
              <p>
                His doctoral research at the University of Southampton focused on educational
                exclusion, shaping the way CodeQuest responds to every learner with compassion and
                clarity.
              </p>
              <p>
                At CodeQuest, he ensures the learning journey is evidence-led, joyful, and built to
                unlock confidence at every step.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {scottCredentials.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cq-border-bright bg-cq-bg-overlay px-3 py-1 text-xs text-cq-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>

            <blockquote className="mt-6 border-l-2 border-cq-primary pl-4 text-cq-text-secondary">
              “Every child I have ever assessed had more potential than their circumstances allowed
              them to show. CodeQuest is our attempt to change those circumstances — at scale.”
            </blockquote>
          </article>

          <article className="rounded-2xl border border-cq-cyan/50 bg-cq-bg-elevated p-8 shadow-glow-cyan">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cq-cyan/60 bg-cq-cyan/20 text-lg font-display text-cq-cyan shadow-glow-cyan">
                AS
              </div>
              <div>
                <h3 className="font-heading text-xl">Air Vice Marshall Abubakar Suleh</h3>
                <p className="text-sm text-cq-text-secondary">Co-Founder · Aircraft Engineer</p>
                <p className="mt-1 text-sm text-cq-cyan">
                  The engineering precision behind the build.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-cq-text-secondary">
              <p>
                Air Vice Marshall Abubakar Suleh is a certified aircraft engineer whose career has
                been defined by uncompromising standards, safety, and systems that must perform
                flawlessly.
              </p>
              <p>
                He brings the same rigor to CodeQuest, building the platform architecture and
                engineering standards that keep every learning experience reliable, fast, and safe.
              </p>
              <p>
                His leadership ensures CodeQuest feels world-class, resilient, and worthy of the
                children it serves.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {avmCredentials.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cq-border-bright bg-cq-bg-overlay px-3 py-1 text-xs text-cq-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>

            <blockquote className="mt-6 border-l-2 border-cq-cyan pl-4 text-cq-text-secondary">
              “In aviation, you build it right or people get hurt. We apply that same non-negotiable
              standard to how we build for children — because they deserve nothing less.”
            </blockquote>
          </article>
        </div>
      </section>

      <section className="border-t border-cq-border bg-cq-bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-[0.45em] text-cq-text-secondary">
            Our Mission
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-cq-gold via-cq-cyan to-cq-primary bg-clip-text text-transparent">
              Build the world where every child becomes a confident creator.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base text-cq-text-secondary sm:text-lg">
            CodeQuest exists to turn curiosity into capability, with a learning journey that is
            story-driven, mentor-led, and grounded in real engineering practice.
          </p>
          <div className="mt-10 flex justify-center">
            <Button size="lg" type="button" onClick={scrollToWaitlist}>
              Join the Waitlist
            </Button>
          </div>
        </div>
      </section>

      <WaitlistCTA />
    </>
  );
}
