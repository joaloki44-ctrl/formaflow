import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paramètres</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Gérez votre profil, vos préférences et votre facturation.</p>
      </div>
      <SettingsClient user={user} />
    </div>
  );
}
