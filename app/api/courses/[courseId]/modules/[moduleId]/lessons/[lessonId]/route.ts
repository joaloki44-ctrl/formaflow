import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const lesson = await prisma.lesson.delete({
      where: {
        id: params.lessonId,
        moduleId: params.moduleId
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[LESSON_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
