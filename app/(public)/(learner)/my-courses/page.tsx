import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyCoursesGrid from "@/components/learner/MyCoursesGrid";
import { BookOpen, AlertCircle, Building2 } from "lucide-react";
import Link from "next/link";

export default async function MyCoursesPage() {
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

  // Fetch org assignments for the current user
  const orgMemberships = await prisma.organizationMember.findMany({
    where: { userId: user.id, inviteStatus: "ACCEPTED" },
    include: { organization: { select: { id: true, name: true } } },
  });

  const orgIds = orgMemberships.map((m) => m.organizationId);

  const assignments = orgIds.length > 0
    ? await prisma.courseAssignment.findMany({
        where: {
          organizationId: { in: orgIds },
          OR: [{ userId: null }, { userId: user.id }],
        },
        include: {
          organization: { select: { id: true, name: true } },
        },
      })
    : [];

  // Build assignment map keyed by courseId
  const assignmentMap = new Map<string, typeof assignments[0]>();
  for (const a of assignments) {
    if (!assignmentMap.has(a.courseId) || a.isMandatory) {
      assignmentMap.set(a.courseId, a);
    }
  }

  // Calculer les stats
  const inProgress = enrollments.filter((e) => e.status === "ACTIVE" && e.totalProgress > 0);
  const completed = enrollments.filter((e) => e.status === "COMPLETED");
  const mandatory = enrollments.filter((e) => assignmentMap.get(e.courseId)?.isMandatory);
  const overdueCount = mandatory.filter((e) => {
    const a = assignmentMap.get(e.courseId);
    return a?.dueDate && new Date(a.dueDate) < new Date() && e.status !== "COMPLETED";
  }).length;

  const enrichedEnrollments = enrollments.map((e) => ({
    ...e,
    assignment: assignmentMap.get(e.courseId) ?? null,
  }));

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl mb-2">Mes formations</h1>
          <p className="text-muted">Continuez votre apprentissage là où vous vous êtes arrêté</p>
        </div>

        {/* Enterprise alert */}
        {overdueCount > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {overdueCount} formation{overdueCount > 1 ? "s" : ""} obligatoire{overdueCount > 1 ? "s" : ""} en retard
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Complétez ces formations dès que possible.
              </p>
            </div>
          </div>
        )}

        {/* Org memberships */}
        {orgMemberships.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {orgMemberships.map((m) => (
              <span key={m.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-xs font-medium text-orange-700">
                <Building2 className="w-3.5 h-3.5" />
                {m.organization.name}
              </span>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-3xl font-bold">{enrollments.length}</p>
            <p className="text-sm text-muted">Inscrites</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-3xl font-bold text-amber-600">{inProgress.length}</p>
            <p className="text-sm text-muted">En cours</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-3xl font-bold text-green-600">{completed.length}</p>
            <p className="text-sm text-muted">Terminées</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-3xl font-bold text-red-500">{mandatory.filter(e => e.status !== "COMPLETED").length}</p>
            <p className="text-sm text-muted">Obligatoires</p>
          </div>
        </div>

        {/* Content */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-serif text-xl mb-2">Aucune formation</h2>
            <p className="text-muted mb-6">Vous n&apos;êtes inscrit à aucune formation pour le moment</p>
            <Link href="/courses" className="btn-primary">
              Découvrir les formations
            </Link>
          </div>
        ) : (
          <MyCoursesGrid enrollments={enrichedEnrollments as any} />
        )}
      </div>
    </div>
  );
}
