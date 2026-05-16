import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users, BookOpen, TrendingUp, Building2, Route, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, Plus,
} from "lucide-react";

export default async function OrgOverviewPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const org = await prisma.organization.findUnique({
    where: { id: params.orgId },
    include: {
      departments: { include: { _count: { select: { members: true } } } },
      _count: { select: { members: true, assignments: true, learningPaths: true } },
    },
  });
  if (!org) redirect("/dashboard");

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: params.orgId, inviteStatus: "ACCEPTED" },
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } } },
  });

  const memberUserIds = members.map((m) => m.userId);
  const assignments = await prisma.courseAssignment.findMany({
    where: { organizationId: params.orgId },
    include: { course: { select: { id: true, title: true, imageUrl: true } } },
  });

  const assignedCourseIds = [...new Set(assignments.map((a) => a.courseId))];
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: { in: memberUserIds }, courseId: { in: assignedCourseIds } },
  });

  const completed = enrollments.filter((e) => e.status === "COMPLETED").length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + e.totalProgress, 0) / enrollments.length)
      : 0;

  const mandatoryAssignments = assignments.filter((a) => a.isMandatory);
  const overdueAssignments = mandatoryAssignments.filter(
    (a) => a.dueDate && new Date(a.dueDate) < new Date()
  );

  // Recent member activities
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { userId: { in: memberUserIds }, courseId: { in: assignedCourseIds } },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { course: { select: { title: true } } },
  });

  const stats = [
    {
      label: "Employés",
      value: members.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      href: `members`,
    },
    {
      label: "Formations assignées",
      value: assignedCourseIds.length,
      icon: BookOpen,
      color: "from-orange-400 to-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      href: `assignments`,
    },
    {
      label: "Complétions",
      value: completed,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      text: "text-green-600",
      href: `analytics`,
    },
    {
      label: "Progression moy.",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
      href: `analytics`,
    },
  ];

  const quickActions = [
    { label: "Ajouter un employé", href: `members`, icon: Users, color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
    { label: "Assigner une formation", href: `assignments`, icon: BookOpen, color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
    { label: "Créer un parcours", href: `learning-paths`, icon: Route, color: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
    { label: "Voir les analytiques", href: `analytics`, icon: BarChart3Comp, color: "text-green-600 bg-green-50 hover:bg-green-100" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-gray-500 mt-1">Tableau de bord entreprise · Plan {org.plan}</p>
          </div>
          <Link
            href={`/org-admin/${params.orgId}/members`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Ajouter un employé
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {overdueAssignments.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {overdueAssignments.length} formation{overdueAssignments.length > 1 ? "s" : ""} obligatoire
              {overdueAssignments.length > 1 ? "s" : ""} en retard
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Certains employés n&apos;ont pas complété les formations obligatoires dans les délais impartis.
            </p>
            <Link href={`/org-admin/${params.orgId}/analytics`} className="text-xs text-red-700 underline mt-1 inline-block font-medium">
              Voir le détail →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={`/org-admin/${params.orgId}/${stat.href}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.text}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              Départements
            </h2>
            <Link href={`/org-admin/${params.orgId}/departments`} className="text-xs text-[#ff6b4a] hover:underline flex items-center gap-1">
              Gérer <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {org.departments.length === 0 ? (
            <div className="text-center py-6">
              <Building2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aucun département</p>
              <Link href={`/org-admin/${params.orgId}/departments`} className="text-xs text-[#ff6b4a] hover:underline mt-1 inline-block">
                Créer un département
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {org.departments.map((dept) => (
                <li key={dept.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 font-medium">{dept.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {dept._count.members} membre{dept._count.members !== 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Activité récente
            </h2>
            <Link href={`/org-admin/${params.orgId}/analytics`} className="text-xs text-[#ff6b4a] hover:underline flex items-center gap-1">
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aucune activité pour l&apos;instant</p>
              <p className="text-xs text-gray-300 mt-1">Assignez des formations pour voir l&apos;activité ici</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentEnrollments.map((enroll, i) => {
                const member = members.find((m) => m.userId === enroll.userId);
                return (
                  <li key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    {member?.user.imageUrl ? (
                      <img src={member.user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#f09340] flex items-center justify-center text-white text-xs font-bold">
                        {member?.user.firstName?.charAt(0) ?? "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {member?.user.firstName} {member?.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{enroll.course.title}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {enroll.status === "COMPLETED" ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Terminé
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                          {Math.round(enroll.totalProgress)}%
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Ajouter un employé", href: "members", icon: Users, cls: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
            { label: "Assigner une formation", href: "assignments", icon: BookOpen, cls: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
            { label: "Créer un parcours", href: "learning-paths", icon: Route, cls: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
            { label: "Voir les analytics", href: "analytics", icon: TrendingUp, cls: "text-green-600 bg-green-50 hover:bg-green-100" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={`/org-admin/${params.orgId}/${action.href}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${action.cls}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BarChart3Comp(props: React.ComponentProps<typeof TrendingUp>) {
  return <TrendingUp {...props} />;
}
