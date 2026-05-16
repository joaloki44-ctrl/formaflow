import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("[STRIPE_WEBHOOK_ERROR]", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account);
      break;
    }
    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      console.log("[STRIPE_WEBHOOK] Payment failed or expired", event.type);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;
  const instructorId = session.metadata?.instructorId;
  const platformFee = parseInt(session.metadata?.platformFee ?? "0", 10);
  const instructorAmount = parseInt(session.metadata?.instructorAmount ?? "0", 10);
  const amountTotal = session.amount_total ?? 0;

  if (!userId || !courseId) {
    console.error("[STRIPE_WEBHOOK] Missing metadata");
    return;
  }

  try {
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: { userId, courseId },
      });
      console.log(`[STRIPE_WEBHOOK] Enrollment created: user=${userId} course=${courseId}`);
    }

    if (instructorId && session.id) {
      const existingPayment = await prisma.payment.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            courseId,
            studentId: userId,
            instructorId,
            amount: amountTotal,
            platformFee,
            instructorAmount,
            currency: session.currency ?? "eur",
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            status: "COMPLETED",
          },
        });
        console.log(`[STRIPE_WEBHOOK] Payment recorded: ${amountTotal}cts — fee=${platformFee}cts`);
      }
    }
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_DB_ERROR]", error);
    throw error;
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeAccountId: account.id },
    });

    if (!user) return;

    const isActive =
      account.details_submitted &&
      account.payouts_enabled &&
      account.charges_enabled;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeOnboardingDone: account.details_submitted,
        stripeAccountStatus: isActive
          ? "active"
          : account.details_submitted
          ? "restricted"
          : "pending",
      },
    });

    console.log(`[STRIPE_WEBHOOK] Account updated: ${account.id} → ${isActive ? "active" : "pending"}`);
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_ACCOUNT_UPDATE]", error);
  }
}
