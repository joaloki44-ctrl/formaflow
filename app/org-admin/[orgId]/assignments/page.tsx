import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import AssignmentsClient from "@/components/org-admin/AssignmentsClient";

export default async function AssignmentsPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const [assignments, departments, courses] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: { organizationId: params.orgId },
      include: {
        course: { select: { id: true, title: true, imageUrl: true, level: true, category: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: { assignedAt: "desc" },
    }),
    prisma.department.findMany({
      where: { organizationId: params.orgId },
      orderBy: { name: "asc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, imageUrl: true, level: true, category: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <AssignmentsClient
      orgId={params.orgId}
      initialAssignments={assignments as any}
      departments={departments as any}
      availableCourses={courses as any}
    />
  );
}
