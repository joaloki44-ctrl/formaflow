import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getAccountStatus, stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Non autorisé", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { stripeAccountId: true, stripeAccountStatus: true, stripeOnboardingDone: true },
    });

    if (!user?.stripeAccountId) {
      return NextResponse.json({ connected: false });
    }

    const status = await getAccountStatus(user.stripeAccountId);

    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripeAccountId,
    });

    const availableEur =
      balance.available.find((b) => b.currency === "eur")?.amount ?? 0;
    const pendingEur =
      balance.pending.find((b) => b.currency === "eur")?.amount ?? 0;

    return NextResponse.json({
      connected: true,
      accountId: user.stripeAccountId,
      status: status.isActive ? "active" : status.detailsSubmitted ? "restricted" : "pending",
      detailsSubmitted: status.detailsSubmitted,
      payoutsEnabled: status.payoutsEnabled,
      chargesEnabled: status.chargesEnabled,
      balance: {
        available: availableEur,
        pending: pendingEur,
      },
    });
  } catch (error) {
    console.error("[STRIPE_CONNECT_ACCOUNT]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
