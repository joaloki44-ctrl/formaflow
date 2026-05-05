import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return <div>Chargement...</div>;
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
    take: 5,
  });

  const totalStudents = await prisma.enrollment.count({
    where: {
      course: { instructorId: user.id },
    },
  });

  const enrollmentsWithCourse = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
    },
    include: {
      course: { select: { price: true } },
    },
  });

  const totalRevenue = enrollmentsWithCourse.reduce(
    (sum, e) => sum + e.course.price, 
    0
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl">Tableau de bord</h1>
          <p className="text-muted mt-1">Bienvenue, {user.firstName} !</p>
        </div>
        <Link 
          href="/dashboard/courses/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </Link>
      </div>

      <DashboardStats 
        totalCourses={courses.length}
        totalStudents={totalStudents}
        totalRevenue={totalRevenue}
      />

      <div className="mt-8">
        <h2 className="font-serif text-xl mb-4">Vos dernières formations</h2>
        <CoursesList courses={courses} />
      </div>
    </div>
  );
}