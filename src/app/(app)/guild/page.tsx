import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GuildHubClient } from "./GuildHubClient";
import { canAccessLesson } from "@/lib/subscription-gate";

export default async function GuildPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    redirect("/auth/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  if (!canAccessLesson(subscription, 1, 2)) {
    return (
      <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
        <div className="mx-auto max-w-2xl rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 text-center shadow-panel">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Locked</p>
          <h1 className="mt-3 text-3xl font-heading text-white">Builder&apos;s Guild</h1>
          <p className="mt-2 text-sm text-cq-text-secondary">
            Upgrade to Champion to form or join a guild.
          </p>
          <div className="mt-6">
            <a
              href="/pricing?locked=true"
              className="inline-flex items-center justify-center rounded-full bg-cq-violet px-6 py-3 text-sm font-semibold text-white shadow-glow-primary"
            >
              Upgrade to Champion
            </a>
          </div>
        </div>
      </main>
    );
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { guildId: true },
  });

  const initialGuild = child?.guildId
    ? await prisma.guild.findUnique({
        where: { id: child.guildId },
        select: {
          id: true,
          name: true,
          emblem: true,
          description: true,
          xpTotal: true,
          trialWins: true,
          isOpen: true,
          maxMembers: true,
          members: {
            select: {
              username: true,
              xpTotal: true,
              xpLevel: true,
            },
            orderBy: { xpTotal: "desc" },
          },
        },
      })
    : null;

  const openGuilds = await prisma.guild.findMany({
    where: { isOpen: true },
    orderBy: { xpTotal: "desc" },
    select: {
      id: true,
      name: true,
      emblem: true,
      xpTotal: true,
      isOpen: true,
      maxMembers: true,
      _count: { select: { members: true } },
    },
  });

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Guild Hub</p>
          <h1 className="mt-2 text-3xl font-heading text-white">Builder&apos;s Guild</h1>
          <p className="mt-2 max-w-2xl text-sm text-cq-text-secondary">
            Form a team, earn collective XP, and compete in weekly Forge Trials.
          </p>
        </header>

        <GuildHubClient
          initialGuild={initialGuild}
          openGuilds={openGuilds.map((guild) => ({
            id: guild.id,
            name: guild.name,
            emblem: guild.emblem,
            xpTotal: guild.xpTotal,
            isOpen: guild.isOpen,
            maxMembers: guild.maxMembers,
            memberCount: guild._count.members,
          }))}
        />
      </div>
    </main>
  );
}
