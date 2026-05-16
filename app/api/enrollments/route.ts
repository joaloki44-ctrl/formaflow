import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) return new NextResponse("Cours non trouvé", { status: 404 });

    // Allow direct enrollment if course is free
    if (course.price > 0) return new NextResponse("Paiement requis", { status: 402 });

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
