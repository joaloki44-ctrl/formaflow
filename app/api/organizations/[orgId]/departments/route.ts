import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

async function requireOrgAdmin(orgId: string) {
  const user = await getOrCreateUser();
  if (!user) return null;
  const m = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: user.id } },
  });
  if (!m || m.role !== "ORG_ADMIN") return null;
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

    const departments = await prisma.department.findMany({
      where: { organizationId: params.orgId },
      include: { _count: { select: { members: true, assignments: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("[DEPARTMENTS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const admin = await requireOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    const { name, managerId } = await req.json();
    if (!name) return new NextResponse("Nom requis", { status: 400 });

    const dept = await prisma.department.create({
      data: { organizationId: params.orgId, name, managerId: managerId || null },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json(dept, { status: 201 });
  } catch (error) {
    console.error("[DEPARTMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
