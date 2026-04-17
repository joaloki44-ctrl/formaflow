import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

// GET - Récupérer les inscriptions de l'utilisateur
export async function GET() {
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

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: { firstName: true, lastName: true },
            },
            _count: {
              select: { modules: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("[ENROLLMENTS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

// POST - Créer une inscription
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return new NextResponse("ID du cours requis", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    // Vérifier si déjà inscrit
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return new NextResponse("Déjà inscrit à ce cours", { status: 400 });
    }

    // Créer l'inscription
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[ENROLLMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}