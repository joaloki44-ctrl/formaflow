import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET(req: Request, { params }: { params: { pathId: string } }) {
  try {
    const path = await prisma.learningPath.findUnique({
      where: { id: params.pathId },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true, title: true, imageUrl: true, level: true, category: true, description: true,
                modules: { select: { _count: { select: { lessons: true } } } },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });
    if (!path) return new NextResponse("Parcours introuvable", { status: 404 });
    return NextResponse.json(path);
  } catch (error) {
    console.error("[LEARNING_PATH_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { pathId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { title, description, imageUrl, isPublished } = await req.json();

    const path = await prisma.learningPath.update({
      where: { id: params.pathId },
      data: { title, description, imageUrl, isPublished },
    });

    return NextResponse.json(path);
  } catch (error) {
    console.error("[LEARNING_PATH_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { pathId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    await prisma.learningPath.delete({ where: { id: params.pathId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LEARNING_PATH_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
