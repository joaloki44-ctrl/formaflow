import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import MembersClient from "@/components/org-admin/MembersClient";

export default async function MembersPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const org = await prisma.organization.findUnique({
    where: { id: params.orgId },
    select: { id: true, name: true },
  });
  if (!org) redirect("/dashboard");

  const departments = await prisma.department.findMany({
    where: { organizationId: params.orgId },
    orderBy: { name: "asc" },
  });

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: params.orgId },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true } },
      department: { select: { id: true, name: true } },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <MembersClient
      orgId={params.orgId}
      orgName={org.name}
      initialMembers={members}
      departments={departments}
    />
  );
}
