import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: {
        organization: {
          include: {
            _count: { select: { members: true, departments: true } },
          },
        },
      },
    });

    return NextResponse.json(memberships);
  } catch (error) {
    console.error("[ORGANIZATIONS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { name, slug, logoUrl, domain } = await req.json();

    if (!name || !slug) {
      return new NextResponse("Nom et identifiant requis", { status: 400 });
    }

    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      return new NextResponse("Cet identifiant est déjà utilisé", { status: 409 });
    }

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        logoUrl,
        domain,
        members: {
          create: {
            userId: user.id,
            role: "ORG_ADMIN",
            inviteStatus: "ACCEPTED",
          },
        },
      },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json(org);
  } catch (error) {
    console.error("[ORGANIZATIONS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
