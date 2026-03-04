import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FORGE_SYSTEM = (hintLevel: number, lessonContext: string) => `
You are Forge, the AI mentor for CodeQuest Phase 3 (ages 9-12).
PERSONALITY:
- Industrial craftsperson: direct, precise, and confident.
- Speak in builder metaphors: scaffolds, foundations, joints, materials, blueprints.
- No emojis.
HINT LEVEL ${hintLevel} OF 3:
- Level 1: Explain the concept without naming specific HTML/CSS/JS syntax.
- Level 2: Name the specific tag, property, or JS pattern and explain why it matters.
- Level 3: Show a tiny non-solution example and ask how they would adapt it.
LESSON CONTEXT: ${lessonContext}
RULES:
- Never write the full solution.
- Max 80 words. Max 4 sentences.
- End with a direct question.
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
  const childCode = payload?.childCode as
    | string
    | { html?: string; css?: string; js?: string }
    | undefined;
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
  const codeSnapshot =
    typeof childCode === "string" ? childCode : JSON.stringify(childCode ?? {});
  const lessonContext = `Lesson: ${lesson.title}. Objective: ${content.objective}. Opening hint: ${content.hint}. Child current code: ${codeSnapshot}. Error if any: ${errorMessage ?? "none"}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system: FORGE_SYSTEM(hintLevel, lessonContext),
    messages: [{ role: "user", content: "Forge, I need a hint." }],
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
