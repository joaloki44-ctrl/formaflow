import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const membership = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: params.orgId, userId: user.id } },
    });
    if (!membership || (membership.role !== "ORG_ADMIN" && membership.role !== "MANAGER")) {
      return new NextResponse("Accès refusé", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");

    const memberWhere = {
      organizationId: params.orgId,
      inviteStatus: "ACCEPTED" as const,
      ...(departmentId ? { departmentId } : {}),
    };

    // Fetch all accepted members with their user info
    const members = await prisma.organizationMember.findMany({
      where: memberWhere,
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } } },
    });

    const memberUserIds = members.map((m) => m.userId);

    // All assignments for this org
    const assignments = await prisma.courseAssignment.findMany({
      where: { organizationId: params.orgId, ...(departmentId ? { departmentId } : {}) },
      include: { course: { select: { id: true, title: true, imageUrl: true } } },
    });

    const assignedCourseIds = [...new Set(assignments.map((a) => a.courseId))];

    // Enrollments for org members in assigned courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: { in: memberUserIds },
        courseId: { in: assignedCourseIds },
      },
    });

    // Compute per-member stats
    const memberStats = members.map((m) => {
      const userEnrollments = enrollments.filter((e) => e.userId === m.userId);
      const completed = userEnrollments.filter((e) => e.status === "COMPLETED").length;
      const avgProgress =
        userEnrollments.length > 0
          ? userEnrollments.reduce((acc, e) => acc + e.totalProgress, 0) / userEnrollments.length
          : 0;
      const mandatoryAssignments = assignments.filter((a) => a.isMandatory && (!a.userId || a.userId === m.userId));
      const mandatoryCompleted = mandatoryAssignments.filter((a) =>
        userEnrollments.find((e) => e.courseId === a.courseId && e.status === "COMPLETED")
      ).length;

      return {
        memberId: m.id,
        user: m.user,
        role: m.role,
        totalEnrolled: userEnrollments.length,
        totalCompleted: completed,
        avgProgress: Math.round(avgProgress),
        mandatoryCompleted,
        mandatoryTotal: mandatoryAssignments.length,
      };
    });

    // Overview stats
    const totalMembers = members.length;
    const totalCompleted = enrollments.filter((e) => e.status === "COMPLETED").length;
    const totalEnrollments = enrollments.length;
    const orgAvgProgress =
      totalEnrollments > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + e.totalProgress, 0) / totalEnrollments)
        : 0;

    // Course completion stats
    const courseStats = assignedCourseIds.map((courseId) => {
      const assignment = assignments.find((a) => a.courseId === courseId)!;
      const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);
      const courseCompleted = courseEnrollments.filter((e) => e.status === "COMPLETED").length;
      return {
        courseId,
        title: assignment.course.title,
        imageUrl: assignment.course.imageUrl,
        isMandatory: assignment.isMandatory,
        enrolled: courseEnrollments.length,
        completed: courseCompleted,
        completionRate: courseEnrollments.length > 0 ? Math.round((courseCompleted / courseEnrollments.length) * 100) : 0,
        avgProgress:
          courseEnrollments.length > 0
            ? Math.round(courseEnrollments.reduce((acc, e) => acc + e.totalProgress, 0) / courseEnrollments.length)
            : 0,
      };
    });

    return NextResponse.json({
      overview: { totalMembers, totalEnrollments, totalCompleted, orgAvgProgress },
      memberStats,
      courseStats,
    });
  } catch (error) {
    console.error("[ORG_ANALYTICS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
