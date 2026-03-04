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

function buildEmbedHtml(title: string, html: string, css: string, js: string) {
  const safeJs = js.replace(/<\/script>/gi, "<\\/script>");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui; background: #ffffff; }
    </style>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      try {
        ${safeJs}
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
  const childId = session.activeChildId;

  const childSession = await prisma.child.findUnique({
    where: { id: childId },
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
  const html = payload?.html as string | undefined;
  const css = payload?.css as string | undefined;
  const js = payload?.js as string | undefined;

  if (!lessonId || html === undefined || css === undefined || js === undefined) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      title: true,
      type: true,
      module: { select: { title: true, phase: { select: { number: true } } } },
    },
  });

  if (!lesson || lesson.type !== "PROJECT" || lesson.module.phase.number !== 3) {
    return NextResponse.json({ error: "NOT_ALLOWED" }, { status: 400 });
  }

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { username: true, displayName: true },
  });

  if (!child) {
    return NextResponse.json({ error: "CHILD_NOT_FOUND" }, { status: 404 });
  }

  const baseSlug = `${slugify(child.username ?? child.displayName ?? "forger")}-${slugify(
    lesson.title,
  )}`;
  let slug = `${baseSlug}-${nanoid(6)}`;

  for (let i = 0; i < 3; i += 1) {
    const exists = await prisma.project.findUnique({ where: { gallerySlug: slug } });
    if (!exists) break;
    slug = `${baseSlug}-${nanoid(6)}`;
  }

  const embedHtml = buildEmbedHtml(lesson.title, html, css, js);
  const embedUrl = await uploadHtmlSnapshot(embedHtml, slug);

  const project = await prisma.project.create({
    data: {
      childId,
      lessonId,
      title: lesson.title,
      description: `Phase ${lesson.module.phase.number} - ${lesson.module.title}`,
      phase: lesson.module.phase.number,
      language: "HTML_CSS",
      code: { html, css, js },
      isPublished: true,
      gallerySlug: slug,
      embedUrl,
      publishedAt: new Date(),
    },
  });

  const now = new Date();
  const activeTournaments = await prisma.tournament.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    select: { id: true },
  });

  if (activeTournaments.length > 0) {
    await prisma.tournamentEntry.createMany({
      data: activeTournaments.map((tournament) => ({
        tournamentId: tournament.id,
        projectId: project.id,
        childId,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ slug });
}
