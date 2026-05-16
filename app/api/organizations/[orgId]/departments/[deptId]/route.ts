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

export async function DELETE(
  req: Request,
  { params }: { params: { orgId: string; deptId: string } }
) {
  try {
    const admin = await requireOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    await prisma.department.delete({ where: { id: params.deptId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DEPT_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orgId: string; deptId: string } }
) {
  try {
    const admin = await requireOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    const { name, managerId } = await req.json();
    const dept = await prisma.department.update({
      where: { id: params.deptId },
      data: { name, managerId: managerId || null },
    });
    return NextResponse.json(dept);
  } catch (error) {
    console.error("[DEPT_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
