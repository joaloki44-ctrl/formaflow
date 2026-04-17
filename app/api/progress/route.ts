import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

// POST - Marquer une leçon comme terminée
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { lessonId, courseId } = await req.json();

    if (!lessonId || !courseId) {
      return new NextResponse("Données manquantes", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    // Vérifier inscription
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (!enrollment) {
      return new NextResponse("Non inscrit à ce cours", { status: 403 });
    }

    // Créer ou mettre à jour le progrès
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: true,
      },
    });

    // Calculer la progression globale du cours
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId: courseId,
        },
      },
    });

    const completedLessons = await prisma.progress.count({
      where: {
        userId: user.id,
        isCompleted: true,
        lesson: {
          module: {
            courseId: courseId,
          },
        },
      },
    });

    const totalProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Mettre à jour l'inscription
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        totalProgress: totalProgress,
        status: totalProgress === 100 ? "COMPLETED" : "ACTIVE",
      },
    });

    return NextResponse.json({ progress, totalProgress });
  } catch (error) {
    console.error("[PROGRESS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

// GET - Récupérer la progression d'un cours
export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new NextResponse("ID du cours requis", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId: user.id,
        lesson: {
          module: {
            courseId: courseId,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[PROGRESS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}