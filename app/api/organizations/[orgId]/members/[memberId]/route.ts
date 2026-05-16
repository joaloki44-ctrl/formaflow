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

export async function PATCH(
  req: Request,
  { params }: { params: { orgId: string; memberId: string } }
) {
  try {
    const admin = await requireOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    const { role, departmentId } = await req.json();

    const member = await prisma.organizationMember.update({
      where: { id: params.memberId },
      data: { role, departmentId: departmentId || null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } },
        department: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("[MEMBER_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orgId: string; memberId: string } }
) {
  try {
    const admin = await requireOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    await prisma.organizationMember.delete({ where: { id: params.memberId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MEMBER_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
