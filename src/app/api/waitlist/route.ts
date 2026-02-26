import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/resend";
import { WaitlistWelcome } from "@/emails/WaitlistWelcome";
import { waitlistSchema } from "@/lib/validations/waitlist";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = waitlistSchema.parse(body);

    const existing = await prisma.waitlist.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, message: "already_registered" });
    }

    await prisma.waitlist.create({ data: { email } });

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 });
    }

    const fromAddress = process.env.RESEND_FROM ?? "CodeQuest <hello@codequest.world>";

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Your CodeQuest adventure is about to begin 🚀",
      react: WaitlistWelcome({ email }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }
    console.error("[WAITLIST]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
