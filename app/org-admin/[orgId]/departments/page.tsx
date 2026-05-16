import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import DepartmentsClient from "@/components/org-admin/DepartmentsClient";

export default async function DepartmentsPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const departments = await prisma.department.findMany({
    where: { organizationId: params.orgId },
    include: {
      _count: { select: { members: true, assignments: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: params.orgId, inviteStatus: "ACCEPTED" },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });

  return <DepartmentsClient orgId={params.orgId} initialDepartments={departments as any} members={members as any} />;
}
