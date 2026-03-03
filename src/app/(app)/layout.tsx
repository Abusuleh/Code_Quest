import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppNav } from "@/components/organisms/AppNav";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const childPhase = session.activeChildId
    ? (
        await prisma.child.findUnique({
          where: { id: session.activeChildId },
          select: { currentPhase: true },
        })
      )?.currentPhase ?? null
    : null;

  return (
    <div className="flex min-h-screen bg-cq-bg text-cq-text-primary">
      <div className="hidden w-64 lg:block">
        <AppNav parentName={session.user.name} role={session.user.role} childPhase={childPhase} />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
