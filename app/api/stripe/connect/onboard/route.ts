import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { createAccountLink, createConnectAccount } from "@/lib/stripe";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Non autorisé", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!user) return new NextResponse("Utilisateur introuvable", { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const returnUrl = `${appUrl}/api/stripe/connect/return`;
    const refreshUrl = `${appUrl}/api/stripe/connect/refresh`;

    let accountId = user.stripeAccountId;

    if (!accountId) {
      const account = await createConnectAccount(user.email);
      accountId = account.id;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeAccountId: accountId,
          stripeAccountStatus: "pending",
          stripeOnboardingDone: false,
        },
      });
    }

    const accountLink = await createAccountLink(accountId, returnUrl, refreshUrl);

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("[STRIPE_CONNECT_ONBOARD]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
