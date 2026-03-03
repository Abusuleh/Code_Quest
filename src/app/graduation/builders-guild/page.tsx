import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BuildersGuildGraduationClient } from "./BuildersGuildGraduationClient";

export default async function BuildersGuildGraduationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    redirect("/auth/login");
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { displayName: true, xpTotal: true },
  });

  if (!child) {
    redirect("/dashboard");
  }

  return <BuildersGuildGraduationClient childName={child.displayName} xpTotal={child.xpTotal} />;
}
