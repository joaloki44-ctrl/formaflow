import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");

    const paths = await prisma.learningPath.findMany({
      where: { organizationId: orgId || null },
      include: {
        courses: {
          include: { course: { select: { id: true, title: true, imageUrl: true, level: true, category: true } } },
          orderBy: { position: "asc" },
        },
        _count: { select: { courses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(paths);
  } catch (error) {
    console.error("[LEARNING_PATHS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { title, description, imageUrl, organizationId } = await req.json();
    if (!title) return new NextResponse("Titre requis", { status: 400 });

    if (organizationId) {
      const membership = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId, userId: user.id } },
      });
      if (!membership || (membership.role !== "ORG_ADMIN" && membership.role !== "MANAGER")) {
        return new NextResponse("Accès refusé", { status: 403 });
      }
    }

    const path = await prisma.learningPath.create({
      data: { title, description, imageUrl, organizationId: organizationId || null },
      include: { _count: { select: { courses: true } } },
    });

    return NextResponse.json(path, { status: 201 });
  } catch (error) {
    console.error("[LEARNING_PATHS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
