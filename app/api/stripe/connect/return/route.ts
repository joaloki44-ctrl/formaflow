import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getAccountStatus } from "@/lib/stripe";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.redirect(
        new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL!)
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user?.stripeAccountId) {
      return NextResponse.redirect(
        new URL("/dashboard/settings?stripe=error", process.env.NEXT_PUBLIC_APP_URL!)
      );
    }

    const status = await getAccountStatus(user.stripeAccountId);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeOnboardingDone: status.detailsSubmitted,
        stripeAccountStatus: status.isActive
          ? "active"
          : status.detailsSubmitted
          ? "restricted"
          : "pending",
      },
    });

    const redirectParam = status.detailsSubmitted ? "stripe=success" : "stripe=incomplete";
    return NextResponse.redirect(
      new URL(`/dashboard/settings?${redirectParam}`, process.env.NEXT_PUBLIC_APP_URL!)
    );
  } catch (error) {
    console.error("[STRIPE_CONNECT_RETURN]", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?stripe=error", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
