import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

// GET - Récupérer les leçons d'un module
export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: params.moduleId },
      orderBy: { position: "asc" },
      include: { quizzes: true },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("[LESSONS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

// POST - Créer une nouvelle leçon
export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    const { title, type, content } = await req.json();

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { position: "desc" },
    });

    const newPosition = (lastLesson?.position || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        type: type || "TEXT",
        content,
        position: newPosition,
        moduleId: params.moduleId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[LESSONS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}