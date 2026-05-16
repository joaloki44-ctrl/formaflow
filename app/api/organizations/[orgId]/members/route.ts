import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

async function requireOrgAdmin(orgId: string) {
  const user = await getOrCreateUser();
  if (!user) return null;
  const m = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: user.id } },
  });
  if (!m || (m.role !== "ORG_ADMIN" && m.role !== "MANAGER")) return null;
  return { user, membership: m };
}

export async function GET(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const ctx = await requireOrgAdmin(params.orgId);
    if (!ctx) return new NextResponse("Accès refusé", { status: 403 });

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");

    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: params.orgId,
        ...(departmentId ? { departmentId } : {}),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("[MEMBERS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { orgId: string } }) {
  try {
    const ctx = await requireOrgAdmin(params.orgId);
    if (!ctx) return new NextResponse("Accès refusé", { status: 403 });

    const { email, role, departmentId } = await req.json();

    if (!email) return new NextResponse("Email requis", { status: 400 });

    const targetUser = await prisma.user.findUnique({ where: { email } });

    if (!targetUser) {
      // Store invite for when the user registers
      const invite = await prisma.organizationMember.create({
        data: {
          organizationId: params.orgId,
          userId: ctx.user.id, // placeholder, will be updated on accept
          role: role || "EMPLOYEE",
          departmentId: departmentId || null,
          inviteEmail: email,
          inviteStatus: "PENDING",
        },
      });
      return NextResponse.json({ invited: true, email, invite }, { status: 201 });
    }

    const existing = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: params.orgId, userId: targetUser.id } },
    });
    if (existing) return new NextResponse("Déjà membre", { status: 409 });

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: params.orgId,
        userId: targetUser.id,
        role: role || "EMPLOYEE",
        departmentId: departmentId || null,
        inviteStatus: "ACCEPTED",
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } },
        department: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("[MEMBERS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
