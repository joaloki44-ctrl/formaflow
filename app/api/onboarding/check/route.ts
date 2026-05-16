export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user-utils";

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return new NextResponse("Non autorisé", { status: 401 });

    return NextResponse.json({
      onboardingDone: user.onboardingDone,
      role: user.role,
    });
  } catch (error) {
    console.error("[ONBOARDING_CHECK]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
