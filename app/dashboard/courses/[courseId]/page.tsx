import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CourseDetail from "@/components/dashboard/courses/CourseDetail";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

interface CourseDetailPageProps {
  params: { courseId: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

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

  if (!course) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl">{course.title}</h1>
            <p className="text-muted text-sm mt-1">
              {course._count.enrollments} inscrits • {course.modules.length} modules
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/courses/${course.id}/edit`}
            className="btn-outline text-sm"
          >
            Modifier
          </Link>
          <Link 
            href={`/dashboard/courses/${course.id}/modules/new`}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter module
          </Link>
        </div>
      </div>

      {/* Course Content */}
      <CourseDetail course={course} />
    </div>
  );
}
