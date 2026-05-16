import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

async function requireAdmin(orgId: string) {
  const user = await getOrCreateUser();
  if (!user) return null;
  const m = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: user.id } },
  });
  if (!m || (m.role !== "ORG_ADMIN" && m.role !== "MANAGER")) return null;
  return user;
}

export async function GET(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const membership = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: params.orgId, userId: user.id } },
    });
    if (!membership) return new NextResponse("Accès refusé", { status: 403 });

    const { searchParams } = new URL(req.url);
    const forUserId = searchParams.get("userId");

    const assignments = await prisma.courseAssignment.findMany({
      where: {
        organizationId: params.orgId,
        ...(forUserId ? { OR: [{ userId: forUserId }, { userId: null }] } : {}),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            level: true,
            category: true,
            modules: { select: { _count: { select: { lessons: true } } } },
          },
        },
        department: { select: { id: true, name: true } },
      },
      orderBy: { assignedAt: "desc" },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[ASSIGNMENTS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const admin = await requireAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    const { courseId, departmentId, userId, isMandatory, dueDate } = await req.json();
    if (!courseId) return new NextResponse("Formation requise", { status: 400 });

    const assignment = await prisma.courseAssignment.create({
      data: {
        organizationId: params.orgId,
        courseId,
        departmentId: departmentId || null,
        userId: userId || null,
        isMandatory: isMandatory ?? false,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedById: admin.id,
      },
      include: {
        course: { select: { id: true, title: true, imageUrl: true, level: true, category: true } },
        department: { select: { id: true, name: true } },
      },
    });

    // Auto-enroll all org members (or department members) in the course
    let memberQuery: { organizationId: string; departmentId?: string } = { organizationId: params.orgId };
    if (departmentId) memberQuery.departmentId = departmentId;

    const membersToEnroll = userId
      ? [{ userId }]
      : await prisma.organizationMember.findMany({
          where: { ...memberQuery, inviteStatus: "ACCEPTED" },
          select: { userId: true },
        });

    const enrollData = membersToEnroll.map((m) => ({
      userId: m.userId,
      courseId,
    }));

    await prisma.enrollment.createMany({ data: enrollData, skipDuplicates: true });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("[ASSIGNMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
