import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyCoursesGrid from "@/components/learner/MyCoursesGrid";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function MyCoursesPage() {
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

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: { firstName: true, lastName: true, imageUrl: true },
            },
            _count: {
              select: { modules: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Calculer les stats
    const inProgress = enrollments.filter((e) => e.status === "ACTIVE" && e.totalProgress > 0);
    const completed = enrollments.filter((e) => e.status === "COMPLETED");

    return (
      <div className="min-h-screen bg-[#faf9f6] pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl mb-2">Mes formations</h1>
            <p className="text-muted">Continuez votre apprentissage là où vous vous êtes arrêté</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-3xl font-bold">{enrollments.length}</p>
              <p className="text-sm text-muted">Formations inscrites</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-3xl font-bold text-amber-600">{inProgress.length}</p>
              <p className="text-sm text-muted">En cours</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-3xl font-bold text-green-600">{completed.length}</p>
              <p className="text-sm text-muted">Terminées</p>
            </div>
          </div>

          {/* Content */}
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="font-serif text-xl mb-2">Aucune formation</h2>
              <p className="text-muted mb-6">Vous n'êtes inscrit à aucune formation pour le moment</p>
              <Link href="/courses" className="btn-primary">
                Découvrir les formations
              </Link>
            </div>
          ) : (
            <MyCoursesGrid enrollments={enrollments} />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("My Courses Page Error:", error);
    throw error;
  }
}
