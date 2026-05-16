import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

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

  // Session checkout complétée
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    try {
      // Vérifier si pas déjà inscrit (double webhook)
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: userId,
          courseId: courseId,
        },
      });

      if (!existingEnrollment) {
        // Créer l'inscription
        await prisma.enrollment.create({
          data: {
            userId: userId,
            courseId: courseId,
          },
        });

        console.log(`[STRIPE_WEBHOOK] Enrollment created for user ${userId} and course ${courseId}`);
      }
    } catch (error) {
      console.error("[STRIPE_WEBHOOK_DB_ERROR]", error);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  // Paiement échoué
  if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
    console.log("[STRIPE_WEBHOOK] Payment failed or expired", event.type);
  }

  return NextResponse.json({ received: true });
}
