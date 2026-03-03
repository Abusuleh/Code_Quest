import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JoinGuildButton } from "./JoinGuildButton";

export default async function GuildProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const child = session?.activeChildId
    ? await prisma.child.findUnique({
        where: { id: session.activeChildId },
        select: { guildId: true },
      })
    : null;

  const guild = await prisma.guild.findUnique({
    where: { id: params.id },
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
        select: { username: true, xpTotal: true, xpLevel: true },
        orderBy: { xpTotal: "desc" },
      },
    },
  });

  if (!guild) {
    return (
      <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
        <p>Guild not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 shadow-panel">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Guild</p>
          <h1 className="mt-2 text-3xl font-heading text-white">
            {guild.emblem} {guild.name}
          </h1>
          <p className="mt-2 text-sm text-cq-text-secondary">{guild.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-cq-text-secondary">
            <span>{guild.members.length} members</span>
            <span>{guild.xpTotal} XP</span>
            <span>{guild.trialWins} Forge wins</span>
            <span>{guild.isOpen ? "Open to join" : "Closed"}</span>
          </div>
          {guild.isOpen && session?.activeChildId && !child?.guildId ? (
            <JoinGuildButton guildId={guild.id} />
          ) : null}
        </header>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Members</p>
          <div className="mt-4 space-y-2">
            {guild.members.map((member, index) => (
              <div
                key={`${member.username ?? "member"}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg-panel px-4 py-3 text-sm"
              >
                <span className="text-white">{member.username ?? "Guildmate"}</span>
                <span className="text-cq-text-secondary">
                  {member.xpTotal} XP · Level {member.xpLevel}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
