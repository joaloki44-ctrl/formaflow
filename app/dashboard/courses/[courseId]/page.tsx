import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CourseDetail from "@/components/dashboard/courses/CourseDetail";
import Link from "next/link";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import { getOrCreateUser } from "@/lib/user-utils";

interface CourseDetailPageProps {
  params: { courseId: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const course = await prisma.course.findUnique({
    where: { 
      id: params.courseId,
      instructorId: user.id,
    },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) redirect("/dashboard");

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-10 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard/courses"
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{course.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-md">Structure du cours</span>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                {course._count.enrollments} inscrits • {course.modules.length} modules
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/courses/${course.id}/edit`}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
          <Link 
            href={`/dashboard/courses/${course.id}/modules/new`}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
          >
            <Plus className="w-4 h-4" />
            Ajouter module
          </Link>
        </div>
      </div>

      <CourseDetail course={course} />
    </div>
  );
}
