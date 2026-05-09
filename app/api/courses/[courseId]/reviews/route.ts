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

    const { rating, comment } = await req.json();

    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: user.id,
        courseId: params.courseId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
