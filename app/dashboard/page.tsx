import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { getOrCreateUser } from "@/lib/user-utils";

export default async function DashboardPage() {
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
    take: 5,
  });

  const totalCourses = await prisma.course.count({
    where: { instructorId: user.id },
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-10 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Tableau de bord</h1>
          <p className="text-muted mt-1 font-medium text-sm">Bienvenue, {user.firstName}. Voici un aperçu de votre activité.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses/new"
            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle formation
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <DashboardStats
          totalCourses={totalCourses}
          totalStudents={totalStudents}
          totalRevenue={totalRevenue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-primary">Formations récentes</h2>
              <Link href="/dashboard/courses" className="text-sm font-bold text-secondary hover:underline underline-offset-4">
                Voir tout
              </Link>
            </div>
            <CoursesList courses={courses} />
          </div>

          <div className="space-y-8">
            <div className="bg-primary p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4 text-white">Besoin d'aide ?</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                  Consultez notre documentation ou contactez le support pour optimiser vos ventes.
                </p>
                <Link href="#" className="inline-flex items-center text-sm font-bold text-secondary hover:text-white transition-colors gap-2">
                  Voir la documentation
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full" />
            </div>

            <div className="border border-gray-100 p-10 rounded-[2.5rem] bg-white shadow-sm">
              <h3 className="font-bold text-primary mb-6">Prochaines étapes</h3>
              <ul className="space-y-5">
                {[
                  "Publier votre premier cours",
                  "Configurer les paiements Stripe",
                  "Personnaliser votre profil",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-muted">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-100 flex-shrink-0 flex items-center justify-center text-[10px]">
                      {i+1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
