export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { createLoginLink } from "@/lib/stripe";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Non autorisé", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { stripeAccountId: true, stripeOnboardingDone: true },
    });

    if (!user?.stripeAccountId || !user?.stripeOnboardingDone) {
      return new NextResponse("Compte Stripe non configuré", { status: 400 });
    }

    const loginLink = await createLoginLink(user.stripeAccountId);

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("[STRIPE_CONNECT_DASHBOARD]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
