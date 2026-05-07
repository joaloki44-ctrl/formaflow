import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { title } = await req.json();

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { position: "desc" },
    });

    const newPosition = (lastLesson?.position || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        position: newPosition,
        moduleId: params.moduleId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("[LESSONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
