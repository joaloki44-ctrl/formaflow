import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, TrendingUp, Award, Clock, ArrowRight,
  Flame, CheckCircle2, Search,
} from "lucide-react";

export default async function LearnerHomePage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const [enrollments, featuredCourses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: { select: { firstName: true, lastName: true } },
            _count: { select: { modules: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const inProgress = enrollments.filter((e) => e.status === "ACTIVE" && e.totalProgress > 0);
  const completed = enrollments.filter((e) => e.status === "COMPLETED");
  const notStarted = enrollments.filter((e) => e.status === "ACTIVE" && e.totalProgress === 0);

  const avgProgress =
    inProgress.length > 0
      ? Math.round(inProgress.reduce((acc, e) => acc + e.totalProgress, 0) / inProgress.length)
      : 0;

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const discoveries = featuredCourses.filter((c) => !enrolledCourseIds.has(c.id)).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Bonjour, {user.firstName ?? "apprenant"} 👋
        </h1>
        <p className="text-gray-500">Continuez votre apprentissage là où vous vous êtes arrêté</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Inscriptions", value: enrollments.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "En cours", value: inProgress.length, icon: Flame, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Terminées", value: completed.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Progression moy.", value: `${avgProgress}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: in progress + not started */}
        <div className="lg:col-span-2 space-y-8">
          {/* In progress */}
          {inProgress.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  En cours
                </h2>
                <Link href="/my-courses" className="text-sm text-[#ff6b4a] hover:underline flex items-center gap-1">
                  Tout voir <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {inProgress.slice(0, 3).map((e) => (
                  <Link key={e.id} href={`/courses/${e.courseId}/learn`}>
                    <div className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all flex gap-4">
                      {e.course.imageUrl ? (
                        <img src={e.course.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-7 h-7 text-orange-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-[#ff6b4a] transition-colors">
                          {e.course.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {e.course.instructor.firstName} {e.course.instructor.lastName}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progression</span>
                            <span className="font-medium">{Math.round(e.totalProgress)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#ff6b4a] to-[#f09340] rounded-full"
                              style={{ width: `${e.totalProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#ff6b4a] self-center flex-shrink-0 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Not started */}
          {notStarted.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                Pas encore commencé
              </h2>
              <div className="space-y-3">
                {notStarted.slice(0, 2).map((e) => (
                  <Link key={e.id} href={`/courses/${e.courseId}/learn`}>
                    <div className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all flex gap-4">
                      {e.course.imageUrl ? (
                        <img src={e.course.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{e.course.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {e.course._count.modules} modules · non commencé
                        </p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full self-center whitespace-nowrap">
                        Commencer
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-green-500" />
                Formations terminées
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {completed.slice(0, 4).map((e) => (
                  <div key={e.id} className="bg-white rounded-2xl border border-green-100 p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{e.course.title}</p>
                      <p className="text-xs text-green-600 mt-0.5">Certificat disponible</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {enrollments.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Aucune formation en cours</h3>
              <p className="text-gray-400 text-sm mb-5">
                Explorez le catalogue et inscrivez-vous à votre première formation
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-semibold hover:opacity-90"
              >
                <Search className="w-4 h-4" />
                Explorer le catalogue
              </Link>
            </div>
          )}
        </div>

        {/* Right: Discover */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">À découvrir</h2>
              <Link href="/courses" className="text-xs text-[#ff6b4a] hover:underline flex items-center gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {discoveries.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Toutes les formations sont déjà dans votre liste</p>
              ) : (
                discoveries.map((c) => (
                  <Link key={c.id} href={`/courses/${c.id}`}>
                    <div className="group flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#ff6b4a] transition-colors">
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c._count.enrollments} inscrit{c._count.enrollments !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/courses"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
