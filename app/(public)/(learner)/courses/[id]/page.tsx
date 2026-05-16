import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseDetailPublic from "@/components/learner/CourseDetailPublic";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id, isPublished: true },
    include: {
      instructor: { select: { firstName: true, lastName: true, imageUrl: true } },
      modules: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  return <CourseDetailPublic course={course} />;
}