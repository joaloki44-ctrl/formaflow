import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return new NextResponse("ID du cours requis", { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    // Récupérer le cours
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return new NextResponse("Cours non trouvé", { status: 404 });
    }

    // Vérifier si déjà inscrit
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return new NextResponse("Déjà inscrit", { status: 400 });
    }

    // Si gratuit, créer l'inscription directement
    if (course.price === 0) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
        },
      });

      return NextResponse.json({ url: `/courses/${courseId}/learn` });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description?.slice(0, 100) || "",
            },
            unit_amount: Math.round(course.price * 100), // Centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=true`,
      metadata: {
        courseId: courseId,
        userId: user.id,
      },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}