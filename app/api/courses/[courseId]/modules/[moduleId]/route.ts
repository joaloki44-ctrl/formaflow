import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const values = await req.json();

    const module = await prisma.module.update({
      where: {
        id: params.moduleId,
        courseId: params.courseId
      },
      data: { ...values }
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("[MODULE_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const module = await prisma.module.delete({
      where: {
        id: params.moduleId,
        courseId: params.courseId
      }
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("[MODULE_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
