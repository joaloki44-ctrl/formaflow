import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import OrgAnalyticsClient from "@/components/org-admin/OrgAnalyticsClient";

export default async function OrgAnalyticsPage({ params }: { params: { orgId: string } }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const [departments, orgData] = await Promise.all([
    prisma.department.findMany({
      where: { organizationId: params.orgId },
      orderBy: { name: "asc" },
    }),
    prisma.organization.findUnique({
      where: { id: params.orgId },
      select: { name: true },
    }),
  ]);

  if (!orgData) redirect("/dashboard");

  return <OrgAnalyticsClient orgId={params.orgId} orgName={orgData.name} departments={departments} />;
}
