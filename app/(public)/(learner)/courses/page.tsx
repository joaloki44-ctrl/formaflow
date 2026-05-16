import { prisma } from "@/lib/prisma";
import CourseGrid from "@/components/learner/CourseGrid";
import HeroLearner from "@/components/learner/HeroLearner";

export default async function CoursesPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string }
}) {
  const query = searchParams.q || "";
  const category = searchParams.category === "Tous" ? "" : searchParams.category || "";

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { instructor: { firstName: { contains: query, mode: 'insensitive' } } },
            { instructor: { lastName: { contains: query, mode: 'insensitive' } } },
          ]
        },
        category ? { category: category } : {}
      ]
    },
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
      <HeroLearner courseCount={courses.length} initialQuery={query} initialCategory={searchParams.category || "Tous"} />
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl mb-8 text-gray-900">
            {query || category ? "Résultats de la recherche" : "Formations disponibles"}
          </h2>
          <CourseGrid courses={courses} />
        </div>
      </section>
    </main>
  );
}
