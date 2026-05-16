import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function POST(req: Request, { params }: { params: { pathId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { courseId, position, isRequired } = await req.json();
    if (!courseId) return new NextResponse("Formation requise", { status: 400 });

    const lastCourse = await prisma.learningPathCourse.findFirst({
      where: { learningPathId: params.pathId },
      orderBy: { position: "desc" },
    });
    const nextPosition = position ?? (lastCourse ? lastCourse.position + 1 : 1);

    const entry = await prisma.learningPathCourse.create({
      data: {
        learningPathId: params.pathId,
        courseId,
        position: nextPosition,
        isRequired: isRequired ?? true,
      },
      include: {
        course: { select: { id: true, title: true, imageUrl: true, level: true, category: true } },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("[PATH_COURSES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { pathId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { courseId } = await req.json();
    await prisma.learningPathCourse.deleteMany({
      where: { learningPathId: params.pathId, courseId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PATH_COURSES_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
