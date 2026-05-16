import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/dashboard/SettingsClient";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      imageUrl: true,
      role: true,
      notificationsEnabled: true,
      weeklyReportsEnabled: true,
      theme: true,
      stripeAccountId: true,
      stripeAccountStatus: true,
      stripeOnboardingDone: true,
    },
  });

  const payments = await prisma.payment.findMany({
    where: { instructorId: user.id, status: "COMPLETED" },
    include: {
      student: { select: { firstName: true, lastName: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const serializedPayments = payments.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paramètres Globaux</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Contrôlez votre environnement, votre facturation et votre sécurité.</p>
      </div>
      <SettingsClient user={fullUser} payments={serializedPayments} />
    </div>
  );
}
