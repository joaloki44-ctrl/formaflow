import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const course = await prisma.course.findUnique({
      where: { id: params.courseId, instructorId: user.id },
      include: {
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              include: { attachments: true }
            }
          },
        },
        reviews: {
          include: { user: { select: { firstName: true, imageUrl: true } } },
          orderBy: { createdAt: "desc" }
        },
        _count: { select: { enrollments: true } }
      },
    });

    if (!course) return new NextResponse("Cours non trouvé", { status: 404 });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const values = await req.json();

    const course = await prisma.course.update({
      where: { id: params.courseId, instructorId: user.id },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    await prisma.course.delete({
      where: { id: params.courseId, instructorId: user.id },
    });

    return new NextResponse("Supprimé", { status: 200 });
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
