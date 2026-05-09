import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const course = await prisma.course.findUnique({
      where: { id: params.courseId, instructorId: user.id },
    });

    if (!course) return new NextResponse("Cours non trouvé", { status: 404 });

    const { title } = await req.json();

    const lastModule = await prisma.module.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = (lastModule?.position || 0) + 1;

    const module = await prisma.module.create({
      data: {
        title,
        position: newPosition,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("[MODULES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
