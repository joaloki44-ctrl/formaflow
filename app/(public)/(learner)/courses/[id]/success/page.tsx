import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SuccessContent from "@/components/learner/SuccessContent";

export default async function SuccessPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  if (!course) {
    redirect("/courses");
  }

  // Vérifier l'inscription
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      courseId: params.id,
    },
  });

  if (!enrollment) {
    // Rediriger vers la page du cours si pas inscrit
    redirect(`/courses/${params.id}`);
  }

  return <SuccessContent course={course} />;
}
