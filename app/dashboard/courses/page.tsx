import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getOrCreateUser } from "@/lib/user-utils";

export default async function DashboardCoursesPage() {
  const user = await getOrCreateUser();

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
          className="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-secondary/90 transition-all shadow-md shadow-secondary/10"
        >
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </Link>
      </div>

      <CoursesList courses={courses} />
    </div>
  );
}
