import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Non autorisé", { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return new NextResponse("ID du cours requis", { status: 400 });

    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    // On-the-fly sync if needed
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          imageUrl: clerkUser.imageUrl || "",
          role: "INSTRUCTOR",
        },
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) return new NextResponse("Cours non trouvé", { status: 404 });

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: courseId },
    });

    if (existingEnrollment) return new NextResponse("Déjà inscrit", { status: 400 });

    if (course.price === 0) {
      await prisma.enrollment.create({
        data: { userId: user.id, courseId: courseId },
      });
      return NextResponse.json({ url: `/courses/${courseId}/learn` });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: course.title,
            description: course.description?.slice(0, 100) || "",
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=true`,
      metadata: { courseId: courseId, userId: user.id },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
