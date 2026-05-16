import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

async function getOrgAdmin(orgId: string) {
  const user = await getOrCreateUser();
  if (!user) return null;
  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: user.id } },
  });
  if (!membership || membership.role !== "ORG_ADMIN") return null;
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

    const org = await prisma.organization.findUnique({
      where: { id: params.orgId },
      include: {
        departments: true,
        _count: { select: { members: true, assignments: true, learningPaths: true } },
      },
    });
    if (!org) return new NextResponse("Organisation introuvable", { status: 404 });

    return NextResponse.json({ ...org, userRole: membership.role });
  } catch (error) {
    console.error("[ORGANIZATION_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const admin = await getOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    const { name, logoUrl, domain } = await req.json();

    const org = await prisma.organization.update({
      where: { id: params.orgId },
      data: { name, logoUrl, domain },
    });

    return NextResponse.json(org);
  } catch (error) {
    console.error("[ORGANIZATION_PATCH]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const admin = await getOrgAdmin(params.orgId);
    if (!admin) return new NextResponse("Accès refusé", { status: 403 });

    await prisma.organization.delete({ where: { id: params.orgId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ORGANIZATION_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
