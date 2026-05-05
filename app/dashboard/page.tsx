import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, LayoutDashboard, Sparkles, PlusCircle } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

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
    <div className="p-8 max-w-7xl mx-auto">
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-10 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Tableau de bord</h1>
          <p className="text-muted mt-1 font-medium">Bienvenue, {user.firstName}. Voici un aperçu de votre activité.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses/new"
            className="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-secondary/90 transition-all shadow-md shadow-secondary/10"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle formation
          </Link>
        </div>
      </div>

      <div className="space-y-10">
        <DashboardStats
          totalCourses={totalCourses}
          totalStudents={totalStudents}
          totalRevenue={totalRevenue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Formations récentes</h2>
              <Link href="/dashboard/courses" className="text-sm font-bold text-secondary hover:underline">
                Voir tout
              </Link>
            </div>
            <CoursesList courses={courses} />
          </div>

          <div className="space-y-8">
            <div className="bg-primary p-8 rounded-2xl text-white">
              <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Consultez notre documentation ou contactez le support pour optimiser vos ventes.
              </p>
              <Link href="#" className="inline-flex items-center text-sm font-bold text-secondary hover:text-white transition-colors">
                Voir la documentation →
              </Link>
            </div>

            <div className="border border-gray-100 p-8 rounded-2xl bg-white">
              <h3 className="font-bold text-primary mb-4">Prochaines étapes</h3>
              <ul className="space-y-4">
                {[
                  "Publier votre premier cours",
                  "Configurer les paiements Stripe",
                  "Personnaliser votre profil",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
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
