import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: { select: { firstName: true, lastName: true } },
            _count: { select: { modules: true } },
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

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return new NextResponse("ID du cours requis", { status: 400 });

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: courseId },
    });

    if (existingEnrollment) return new NextResponse("Déjà inscrit", { status: 400 });

    const enrollment = await prisma.enrollment.create({
      data: { userId: user.id, courseId: courseId },
      include: { course: true },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("[ENROLLMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
