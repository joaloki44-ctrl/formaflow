import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import { getOrCreateUser } from "@/lib/user-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#faf9f6]">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
