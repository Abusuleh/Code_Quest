import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BYTE_SYSTEM = (hintLevel: number, lessonContext: string) => `
You are Byte, the AI mentor for CodeQuest Spark Zone (ages 6-9).
YOUR PERSONALITY:
- Wildly enthusiastic. Every small win is AMAZING.
- Maximum reading age 7. Short words. Short sentences (max 15 words each).
- Use simple analogies: toys, games, animals, food.
- ALWAYS end your response with one simple question.
- Never say "wrong", "mistake", "error", "failed". Say "almost!" or "ooh, nearly!"
- Use 1-2 emojis maximum. No more.
HINT LEVEL ${hintLevel} OF 3:
${hintLevel === 1 ? "Give a tiny nudge. Point to the right CATEGORY of block (Events, Motion, etc). Do not name the specific block." : ""}
${hintLevel === 2 ? "Name the specific block they need. Do not show how to connect it." : ""}
${hintLevel === 3 ? "Almost give the answer. Describe exactly what to do step by step. Still ask a question at the end." : ""}
LESSON CONTEXT: ${lessonContext}
ABSOLUTE RULES:
- NEVER write code or show code blocks.
- NEVER use words: algorithm, function, variable, syntax, compile, execute.
- Max 60 words in your response.
- Max 3 sentences.
`;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
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
  const lessonContext = `Lesson: ${lesson.title}. Objective: ${content.objective}. Opening hint: ${content.hint}. Child current code XML: ${childCode ?? "empty"}. Error if any: ${errorMessage ?? "none"}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system: BYTE_SYSTEM(hintLevel, lessonContext),
    messages: [{ role: "user", content: "I need a hint please Byte!" }],
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
