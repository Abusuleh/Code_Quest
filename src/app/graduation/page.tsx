import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GraduationClient } from "./GraduationClient";

export default async function GraduationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    redirect("/parent/dashboard");
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { displayName: true, xpTotal: true },
  });

  if (!child) {
    redirect("/parent/dashboard");
  }

  return <GraduationClient childName={child.displayName} xpTotal={child.xpTotal} />;
}
