import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { render } from "@react-email/render";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signEmailToken } from "@/lib/tokens";
import { rateLimit } from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";
import { EmailVerification } from "@/emails/EmailVerification";

const VERIFY_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const payload = await request.json().catch(() => null);
  const email = session?.user?.email ?? payload?.email;

  if (!email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const limiter = rateLimit(`resend:${email}`, { limit: 3, windowMs: 60 * 60 * 1000 });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || user.emailVerified) {
    return NextResponse.json({ error: "INVALID_STATE" }, { status: 400 });
  }

  const token = signEmailToken({ userId: user.id });
  const expiresAt = new Date(Date.now() + VERIFY_WINDOW_MS);
  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expires: expiresAt,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify-email/confirm?token=${encodeURIComponent(token)}`;

  const resend = getResend();
  if (resend) {
    const html = await render(EmailVerification({ verifyUrl }));
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "CodeQuest <hello@codequest.world>",
      to: email,
      subject: "Verify your CodeQuest email",
      html,
    });
  }

  return NextResponse.json({ ok: true });
}
