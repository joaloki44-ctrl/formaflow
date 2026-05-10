import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardCoursesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl">Mes Formations</h1>
            <p className="text-muted mt-1">Gérez vos contenus pédagogiques</p>
          </div>
          <Link
            href="/dashboard/courses/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle formation
          </Link>
        </div>

        <CoursesList courses={courses} />
      </div>
    );
  } catch (error) {
    console.error("Dashboard Courses Page Error:", error);
    throw error;
  }
}
