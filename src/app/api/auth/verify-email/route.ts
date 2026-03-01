import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailToken } from "@/lib/tokens";
import { getResend } from "@/lib/resend";
import { render } from "@react-email/render";
import { WelcomeParent } from "@/emails/WelcomeParent";
import { rateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function handleVerify(token: string, request: NextRequest) {
  const limiter = rateLimit(`verify-email:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  let payload: { userId: string };
  try {
    payload = verifyEmailToken(token);
  } catch {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (record && record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => null);
    return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 400 });
  }
  if (record && record.userId !== payload.userId) {
    return NextResponse.json({ error: "TOKEN_MISMATCH" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { emailVerified: new Date() },
  });

  if (record) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => null);
  }

  const resend = getResend();
  if (resend && user.email) {
    const html = await render(WelcomeParent({ name: user.name ?? "Parent" }));
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "CodeQuest <hello@codequest.world>",
      to: user.email,
      subject: "Welcome to CodeQuest",
      html,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }
  return handleVerify(token, request);
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const token = payload?.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }
  return handleVerify(token, request);
}
