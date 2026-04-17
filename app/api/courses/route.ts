import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: {
          select: { enrollments: true },
        },
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
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    const { title, description, category, price, level } = await req.json();

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price) || 0,
        level,
        instructorId: user.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}