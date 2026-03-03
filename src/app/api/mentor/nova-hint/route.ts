import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const NOVA_SYSTEM = (hintLevel: number, lessonContext: string) => `
You are Nova, the AI mentor for CodeQuest Builder's Guild (ages 8-11).
YOUR PERSONALITY:
- Precise and technical but always warm. You speak like a brilliant engineer.
- You explain the WHY behind every concept — not just the how.
- Maximum reading age 10. Use real technical words but always define them simply.
- Use analogies from: building, engineering, science, cooking, sport.
- ALWAYS end your response with one thought-provoking question.
- Never say "wrong" or "mistake". Say "interesting approach — let's think about this."
- Use 1 emoji maximum per response.
HINT LEVEL ${hintLevel} OF 3:
- Level 1: Explain the concept they need without naming the specific syntax.
- Level 2: Name the specific Python keyword or pattern. Explain what it does.
- Level 3: Show the pattern with a simple non-solution example. Ask what they'd change.
LESSON CONTEXT: ${lessonContext}
ABSOLUTE RULES:
- Never write the solution code directly.
- Never use words: algorithm (explain it instead), compile, runtime (without definition).
- Max 80 words. Max 4 sentences.
- Always reference what they already know from Phase 1 if relevant.
`;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const childSession = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { activeSessionToken: true },
  });
  if (
    !childSession?.activeSessionToken ||
    childSession.activeSessionToken !== session.activeChildSessionToken
  ) {
    return NextResponse.json({ reason: "SESSION_DISPLACED" }, { status: 409 });
  }

  const payload = await request.json().catch(() => null);
  const lessonId = payload?.lessonId as string | undefined;
  const childCode = payload?.childCode as string | undefined;
  const errorMessage = payload?.errorMessage as string | undefined;
  const attemptNumber = Number(payload?.attemptNumber ?? 1);

  if (!lessonId) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const deduction = await prisma.child.updateMany({
    where: {
      id: session.activeChildId,
      gems: { gte: 10 },
    },
    data: { gems: { decrement: 10 } },
  });

  if (deduction.count === 0) {
    return NextResponse.json({ error: "INSUFFICIENT_GEMS" }, { status: 402 });
  }

  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    select: { content: true, title: true },
  });
  const content = lesson.content as { objective?: string; hint?: string };

  const hintLevel = Math.min(Math.max(attemptNumber, 1), 3);
  const lessonContext = `Lesson: ${lesson.title}. Objective: ${content.objective}. Opening hint: ${content.hint}. Child current code: ${childCode ?? "empty"}. Error if any: ${errorMessage ?? "none"}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system: NOVA_SYSTEM(hintLevel, lessonContext),
    messages: [{ role: "user", content: "Nova, I need a hint please." }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      stream.on("text", (textDelta) => {
        controller.enqueue(encoder.encode(textDelta));
      });
      stream.on("end", () => controller.close());
      stream.on("error", (error) => controller.error(error));
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
