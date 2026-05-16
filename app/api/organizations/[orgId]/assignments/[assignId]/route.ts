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

export async function DELETE(
  req: Request,
  { params }: { params: { orgId: string; assignId: string } }
) {
  try {
    const admin = await requireAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    await prisma.courseAssignment.delete({ where: { id: params.assignId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ASSIGNMENT_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
