import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import OrgSidebar from "@/components/org-admin/OrgSidebar";
import OrgMobileNav from "@/components/org-admin/OrgMobileNav";

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (!user.onboardingDone) redirect("/onboarding");

  // Seuls les comptes Entreprise accèdent à l'espace org-admin
  if (user.role !== "COMPANY" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: params.orgId, userId: user.id } },
    include: { organization: true },
  });

  if (!membership || (membership.role !== "ORG_ADMIN" && membership.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const org = membership.organization;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#faf9f6]">
      <OrgMobileNav orgId={org.id} orgName={org.name} />
      <OrgSidebar orgId={org.id} orgName={org.name} orgLogoUrl={org.logoUrl} />
      <main className="flex-1 w-full overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
