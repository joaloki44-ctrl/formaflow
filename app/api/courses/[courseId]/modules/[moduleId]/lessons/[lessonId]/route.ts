import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const values = await req.json();

    const lesson = await prisma.lesson.update({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId
      },
      data: { ...values }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[LESSON_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const lesson = await prisma.lesson.delete({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[LESSON_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
