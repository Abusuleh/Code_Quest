import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validations/auth";
import { signEmailToken } from "@/lib/tokens";
import { getResend } from "@/lib/resend";
import { EmailVerification } from "@/emails/EmailVerification";
import { rateLimit } from "@/lib/rate-limit";

const VERIFY_WINDOW_MS = 24 * 60 * 60 * 1000;

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const limiter = rateLimit(`register:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    if (!existing.emailVerified) {
      const token = signEmailToken({ userId: existing.id });
      const expiresAt = new Date(Date.now() + VERIFY_WINDOW_MS);
      await prisma.verificationToken.create({
        data: {
          token,
          userId: existing.id,
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
          to: existing.email,
          subject: "Verify your CodeQuest email",
          html,
        });
      }

      return NextResponse.json({ ok: true, resent: true }, { status: 201 });
    }

    return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name ?? null,
      passwordHash,
      role: "PARENT",
    },
  });

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
      to: parsed.data.email,
      subject: "Verify your CodeQuest email",
      html,
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
