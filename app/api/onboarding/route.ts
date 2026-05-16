import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";

const VALID_ROLES = ["STUDENT", "INSTRUCTOR", "COMPANY"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    const { role } = await req.json();

    if (!VALID_ROLES.includes(role as ValidRole)) {
      return new NextResponse("Rôle invalide", { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: role as ValidRole,
        onboardingDone: true,
      },
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("[ONBOARDING_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
