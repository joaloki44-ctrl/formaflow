import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { name, url } = await req.json();

    const attachment = await prisma.attachment.create({
      data: {
        name,
        url,
        lessonId: params.lessonId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[ATTACHMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
