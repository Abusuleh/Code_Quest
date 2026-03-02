import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { uploadHtmlSnapshot } from "@/lib/cloudinary";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);

function buildEmbedHtml(title: string, code: string) {
  const safeCode = code.replace(/<\/script>/gi, "<\\/script>");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { margin: 0; background: #ffffff; font-family: sans-serif; }
      #stage { display: block; margin: 12px auto; border: 2px solid #111827; background: #ffffff; }
      #speech { text-align: center; font-weight: 600; color: #111827; }
    </style>
  </head>
  <body>
    <canvas id="stage" width="400" height="300"></canvas>
    <div id="speech"></div>
    <script>
      const canvas = document.getElementById("stage");
      const ctx = canvas.getContext("2d");
      const state = { x: 200, y: 150, angle: 0, penDown: false, color: "#00D4FF" };
      let lastAnswer = "";

      function move(steps) {
        const radians = (Math.PI / 180) * state.angle;
        const newX = state.x + Math.cos(radians) * steps;
        const newY = state.y + Math.sin(radians) * steps;
        if (state.penDown) {
          ctx.strokeStyle = state.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(state.x, state.y);
          ctx.lineTo(newX, newY);
          ctx.stroke();
        }
        state.x = newX;
        state.y = newY;
      }

      function turnRight(deg) {
        state.angle = (state.angle + Number(deg)) % 360;
      }

      function penDown() {
        state.penDown = true;
      }

      function setPenColor(color) {
        state.color = color;
      }

      function say(text) {
        const el = document.getElementById("speech");
        if (el) el.textContent = String(text ?? "");
      }

      function ask(question) {
        lastAnswer = prompt(String(question ?? "")) || "";
        return lastAnswer;
      }

      function getAnswer() {
        return lastAnswer;
      }

      try {
        ${safeCode}
      } catch (err) {
        console.error(err?.message || "Runtime error");
      }
    </script>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const lessonId = payload?.lessonId as string | undefined;
  const workspaceXml = payload?.workspaceXml as string | undefined;
  const generatedCode = payload?.generatedCode as string | undefined;

  if (!lessonId || !workspaceXml || !generatedCode) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      title: true,
      type: true,
      module: {
        select: {
          title: true,
          phase: { select: { number: true } },
        },
      },
    },
  });

  if (!lesson || lesson.type !== "PROJECT") {
    return NextResponse.json({ error: "NOT_ALLOWED" }, { status: 400 });
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { username: true, displayName: true },
  });

  if (!child) {
    return NextResponse.json({ error: "CHILD_NOT_FOUND" }, { status: 404 });
  }

  const baseSlug = `${slugify(child.username ?? child.displayName ?? "pioneer")}-${slugify(
    lesson.title,
  )}`;
  let slug = `${baseSlug}-${nanoid(6)}`;

  for (let i = 0; i < 3; i += 1) {
    const exists = await prisma.project.findUnique({ where: { gallerySlug: slug } });
    if (!exists) break;
    slug = `${baseSlug}-${nanoid(6)}`;
  }

  const embedHtml = buildEmbedHtml(lesson.title, generatedCode);
  const embedUrl = await uploadHtmlSnapshot(embedHtml, slug);

  await prisma.project.create({
    data: {
      childId: session.activeChildId,
      lessonId,
      title: lesson.title,
      description: `Phase ${lesson.module.phase.number} · ${lesson.module.title}`,
      phase: lesson.module.phase.number,
      language: "SCRATCH",
      code: {
        xml: workspaceXml,
        js: generatedCode,
      },
      isPublished: true,
      gallerySlug: slug,
      embedUrl,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ slug });
}
