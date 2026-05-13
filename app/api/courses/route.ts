import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { title, description, category, price, level, imageUrl, videoUrl } = await req.json();

    const course = await prisma.course.create({
      data: {
        title,
        description: description || "",
        category,
        price: parseFloat(price) || 0,
        level: level || "BEGINNER",
        imageUrl,
        videoUrl,
        instructorId: user.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
