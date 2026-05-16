import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { stripe, calculatePlatformFee } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Non autorisé", { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return new NextResponse("ID du cours requis", { status: 400 });

    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          imageUrl: clerkUser.imageUrl || "",
          role: "STUDENT",
        },
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        instructor: {
          select: {
            id: true,
            stripeAccountId: true,
            stripeOnboardingDone: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("Cours non trouvé", { status: 404 });

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId },
    });
    if (existingEnrollment) return new NextResponse("Déjà inscrit", { status: 400 });

    if (course.price === 0) {
      await prisma.enrollment.create({
        data: { userId: user.id, courseId },
      });
      return NextResponse.json({ url: `/courses/${courseId}/learn` });
    }

    const amountCents = Math.round(course.price * 100);
    const platformFeeCents = calculatePlatformFee(amountCents);
    const hasConnectAccount =
      course.instructor.stripeAccountId && course.instructor.stripeOnboardingDone;

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description?.slice(0, 100) || "",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=true`,
      metadata: {
        courseId,
        userId: user.id,
        instructorId: course.instructor.id,
        platformFee: platformFeeCents.toString(),
        instructorAmount: (amountCents - platformFeeCents).toString(),
      },
      customer_email: user.email,
    };

    if (hasConnectAccount) {
      sessionParams.payment_intent_data = {
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: course.instructor.stripeAccountId!,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
