import { prisma } from "@/lib/prisma";
import CourseGrid from "@/components/learner/CourseGrid";
import HeroLearner from "@/components/learner/HeroLearner";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      instructor: {
        select: { firstName: true, lastName: true, imageUrl: true },
      },
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <HeroLearner courseCount={courses.length} />
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl mb-8 text-gray-900">Formations disponibles</h2>
          <CourseGrid courses={courses} />
        </div>
      </section>
    </main>
  );
}
