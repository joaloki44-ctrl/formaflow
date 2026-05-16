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
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Mes Formations</h1>
          <p className="text-muted mt-1 font-medium text-sm">Gérez et optimisez vos contenus pédagogiques</p>
        </div>
        <Link
          href="/dashboard/courses/new"
          className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10"
        >
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 p-2 shadow-sm">
        <CoursesList courses={courses} />
      </div>
    </div>
  );
}
