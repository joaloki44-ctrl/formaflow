import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CoursePlayer from "@/components/learner/CoursePlayer";

export default async function LearnPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      redirect("/sign-in");
    }

    // Vérifier inscription
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: params.id,
      },
    });

    if (!enrollment) {
      redirect(`/courses/${params.id}`);
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id, isPublished: true },
      include: {
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      notFound();
    }

    // Récupérer la progression
    const progress = await prisma.progress.findMany({
      where: {
        userId: user.id,
        isCompleted: true,
      },
    });

    const completedLessonIds = new Set(progress.map((p) => p.lessonId));

    return (
      <CoursePlayer
        course={course}
        completedLessons={completedLessonIds}
        enrollmentId={enrollment.id}
      />
    );
  } catch (error) {
    console.error("Learn Page Error:", error);
    throw error;
  }
}
