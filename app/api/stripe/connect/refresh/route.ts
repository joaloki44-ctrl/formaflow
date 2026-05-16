export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { createAccountLink } from "@/lib/stripe";

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const accountLink = await createAccountLink(
      user.stripeAccountId,
      `${appUrl}/api/stripe/connect/return`,
      `${appUrl}/api/stripe/connect/refresh`
    );

    return NextResponse.redirect(accountLink.url);
  } catch (error) {
    console.error("[STRIPE_CONNECT_REFRESH]", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?stripe=error", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
