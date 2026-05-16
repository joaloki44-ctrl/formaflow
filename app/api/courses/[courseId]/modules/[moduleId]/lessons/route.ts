import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const values = await req.json();

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { position: "desc" },
    });

    const newPosition = (lastLesson?.position || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        ...values,
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
