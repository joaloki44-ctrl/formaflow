import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import LearningPathsClient from "@/components/org-admin/LearningPathsClient";

export default async function LearningPathsPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const [paths, courses] = await Promise.all([
    prisma.learningPath.findMany({
      where: { organizationId: params.orgId },
      include: {
        courses: {
          include: { course: { select: { id: true, title: true, imageUrl: true, level: true, category: true } } },
          orderBy: { position: "asc" },
        },
        _count: { select: { courses: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, imageUrl: true, level: true, category: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return <LearningPathsClient orgId={params.orgId} initialPaths={paths} availableCourses={courses} />;
}
