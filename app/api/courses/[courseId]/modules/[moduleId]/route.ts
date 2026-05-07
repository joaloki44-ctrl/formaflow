import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const module = await prisma.module.delete({
      where: {
        id: params.moduleId,
        courseId: params.courseId
      }
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("[MODULE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
